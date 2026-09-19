import re
import copy
from typing import Optional, Dict, Any, List
from backend.schemas.property import (
    PredictionInput, ChatRequest, ChatResponse, WhatIfResponse
)
from backend.services.ml_service import MLService, format_inr
from backend.agent.whatif import WhatIfEngine

class PropertyAIAssistant:
    @staticmethod
    def process_chat(request: ChatRequest) -> ChatResponse:
        user_msg = request.message.strip().lower()
        prop = request.current_property
        ml = MLService.get_instance()
        
        suggested_questions = [
            "Why is my property valued at this price?",
            "What if my property was 1500 sq.ft?",
            "Which feature affects my valuation the most?",
            "How can I increase my property's market value?",
            "What if I convert it to Fully Furnished?",
            "Compare 2 BHK vs 3 BHK valuation in this locality"
        ]
        
        # 1. Handle What-If Area Queries
        if any(w in user_msg for w in ["what if", "if", "suppose", "increase", "resize", "change"]) and prop:
            area_num_match = re.search(r'(\d{3,5})\s*(?:sq\.?\s*ft|sqft|square feet|sq)?', user_msg)
            if area_num_match and any(w in user_msg for w in ["sq", "area", "size", "feet", "ft", "space"]):
                new_area = float(area_num_match.group(1))
                if 100 <= new_area <= 20000 and new_area != prop.area:
                    whatif_res = WhatIfEngine.simulate(prop, {"area": new_area})
                    reply = (
                        f"🔬 **What-If Simulation Result:**\n\n"
                        f"If the super built-up area was resized to **{int(new_area):,} sq.ft** (from {int(prop.area):,} sq.ft):\n\n"
                        f"• **Current Valuation:** {whatif_res.original_price_formatted}\n"
                        f"• **Simulated Valuation:** {whatif_res.new_price_formatted}\n"
                        f"• **Net Difference:** {whatif_res.price_diff_formatted} ({whatif_res.percentage_change:+0.1f}%)\n\n"
                        f"*Note: This estimate is computed live from the trained {ml.metadata.get('best_model_name', 'ML model')} incorporating regional price-per-sq.ft and locality multipliers.*"
                    )
                    return ChatResponse(
                        reply=reply,
                        suggested_questions=suggested_questions,
                        counterfactual_prediction=whatif_res.model_dump(),
                        what_if_trigger={"field": "area", "value": new_area}
                    )

            # BHK query: "what if 3 bhk", "what if 4 bhk"
            bhk_match = re.search(r'(\d)\s*(?:bhk|bedroom)', user_msg)
            if bhk_match:
                new_bhk = int(bhk_match.group(1))
                if 1 <= new_bhk <= 6 and new_bhk != prop.bhk:
                    whatif_res = WhatIfEngine.simulate(prop, {"bhk": new_bhk, "bedrooms": new_bhk})
                    reply = (
                        f"🔬 **What-If BHK Simulation:**\n\n"
                        f"Reconfiguring this unit to a **{new_bhk} BHK** layout (currently {prop.bhk} BHK):\n\n"
                        f"• **Current Valuation:** {whatif_res.original_price_formatted}\n"
                        f"• **Simulated Valuation:** {whatif_res.new_price_formatted}\n"
                        f"• **Net Difference:** {whatif_res.price_diff_formatted} ({whatif_res.percentage_change:+0.1f}%)\n\n"
                        f"Higher BHK configurations command higher rental demand and buyer interest in {prop.locality}, {prop.city}."
                    )
                    return ChatResponse(
                        reply=reply,
                        suggested_questions=suggested_questions,
                        counterfactual_prediction=whatif_res.model_dump(),
                        what_if_trigger={"field": "bhk", "value": new_bhk}
                    )

        # Furnishing query: "what if fully furnished" / "what if unfurnished"
        if ("fully furnished" in user_msg or "semi-furnished" in user_msg or "unfurnished" in user_msg) and prop:
            target_furn = "Fully Furnished" if "fully" in user_msg else ("Semi-Furnished" if "semi" in user_msg else "Unfurnished")
            whatif_res = WhatIfEngine.simulate(prop, {"furnished": target_furn})
            reply = (
                f"🛋️ **Furnishing Impact Simulation:**\n\n"
                f"Changing the furnishing status to **{target_furn}** (currently {prop.furnished}):\n\n"
                f"• **Current Valuation:** {whatif_res.original_price_formatted}\n"
                f"• **Simulated Valuation:** {whatif_res.new_price_formatted}\n"
                f"• **Net Difference:** {whatif_res.price_diff_formatted} ({whatif_res.percentage_change:+0.1f}%)\n\n"
                f"Premium modular kitchens, wardrobes, and designer fittings directly enhance immediate buyer appeal and appraised valuation."
            )
            return ChatResponse(
                reply=reply,
                suggested_questions=suggested_questions,
                counterfactual_prediction=whatif_res.model_dump(),
                what_if_trigger={"field": "furnished", "value": target_furn}
            )

        # 2. "Why is my property valued at X?" / Explain question
        if any(w in user_msg for w in ["why", "explain", "valuation", "reason", "breakdown", "factor", "how did you calculate"]):
            if prop:
                pred_res = ml.predict(prop)
                pos_factors = [f"• **{c.display_name}**: +{format_inr(c.shap_value)} ({c.description})" for c in pred_res.top_positive_features[:3]]
                neg_factors = [f"• **{c.display_name}**: -{format_inr(abs(c.shap_value))} ({c.description})" for c in pred_res.top_negative_features[:2]]
                
                pos_str = "\n".join(pos_factors) if pos_factors else "• Regional baseline rate"
                neg_str = "\n".join(neg_factors) if neg_factors else "• Minimal negative penalties"
                
                reply = (
                    f"📊 **Valuation Breakdown for {prop.locality}, {prop.city} ({pred_res.price_formatted})**\n\n"
                    f"Based on the trained **{pred_res.model_name}** (R²: {pred_res.model_r2:.2f}), the price is driven by:\n\n"
                    f"**Top Value Boosters:**\n{pos_str}\n\n"
                    f"**Value Restraints / Depreciation:**\n{neg_str}\n\n"
                    f"Estimated price per sq.ft is **₹{pred_res.price_per_sqft:,.0f}**, placing it within the 80% confidence interval of **{pred_res.lower_range_formatted} — {pred_res.upper_range_formatted}**."
                )
                return ChatResponse(reply=reply, suggested_questions=suggested_questions)
            else:
                return ChatResponse(
                    reply="I can explain exact price drivers once you provide a property or run a prediction from the Predict page! You can also configure parameters on the form to see live SHAP values.",
                    suggested_questions=suggested_questions
                )

        # 3. "Which feature affects my price the most?"
        if any(w in user_msg for w in ["most", "highest impact", "important feature", "key driver"]):
            if prop:
                pred_res = ml.predict(prop)
                if pred_res.top_positive_features:
                    top_driver = pred_res.top_positive_features[0]
                    reply = (
                        f"🎯 **Primary Valuation Driver:**\n\n"
                        f"The single most impactful feature for your property is **{top_driver.display_name}**, contributing **+{format_inr(top_driver.shap_value)}** to your valuation.\n\n"
                        f"In real-estate ML models, **Location (Locality/City tier)** and **Super Built-up Area** generally account for ~70% of feature variance, followed by **BHK layout**, **Property Age**, and **Amenities**."
                    )
                else:
                    reply = "Location and Total Built-up Area are the primary determinants of property valuation in this model."
                return ChatResponse(reply=reply, suggested_questions=suggested_questions)

        # 4. "How can I increase the property's value?" / Suggestions
        if any(w in user_msg for w in ["increase", "improve", "value add", "suggestions", "renovate", "higher price"]):
            if prop:
                # Test renovation effect
                renov_sim = WhatIfEngine.simulate(prop, {"property_condition": "New", "furnished": "Fully Furnished"})
                gain = renov_sim.price_diff
                gain_str = format_inr(gain)
            else:
                gain_str = "₹4 Lakhs - ₹12 Lakhs"
                
            reply = (
                f"💡 **Property Value Enhancement Strategies:**\n\n"
                f"Here are practical improvements with estimated valuation uplifts:\n\n"
                f"1. **Interior Modernization & Modular Furnishing:**\n"
                f"   Upgrading to high-spec modular kitchen, concealed LED lighting, and built-in wardrobes can increase appraisal by **+{gain_str}**.\n\n"
                f"2. **Renovation & Aesthetic Restoration:**\n"
                f"   Repainting, bathroom tile refinishing, and fixing minor cosmetic flaws shifts property condition to *Good/New*.\n\n"
                f"3. **Smart Home & Security Amenities:**\n"
                f"   Adding video doorbells, CCTV, backup power inverter, and smart locks attracts premium buyers and faster closings.\n\n"
                f"4. **Dedicated Parking Space Documentation:**\n"
                f"   Clearly demarcated covered parking adds ₹1.2L–₹2.5L in urban societies.\n\n"
                f"*(Note: Suggestions are industry best-practices and should be verified with local appraisers).* "
            )
            return ChatResponse(reply=reply, suggested_questions=suggested_questions)

        # 5. General Greeting / Fallback
        reply = (
            f"Hello! I am your **PropertyAI Assistant** powered by HouseAI's machine learning engine.\n\n"
            f"I can assist you with:\n"
            f"• 📈 Explaining why a property was valued at a certain price (SHAP feature contribution analysis)\n"
            f"• 🧪 Running **What-If counterfactuals** (e.g. *'What if area was 1600 sq.ft?'* or *'What if 3 BHK?'*)\n"
            f"• 💡 Providing data-driven suggestions to boost property valuation\n"
            f"• 🏙️ Comparing localities across 8 Indian metro regions\n\n"
            f"What would you like to explore today?"
        )
        return ChatResponse(reply=reply, suggested_questions=suggested_questions)
