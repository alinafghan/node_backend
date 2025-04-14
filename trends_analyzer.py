import pandas as pd
import numpy as np
from pytrends.request import TrendReq
from prophet import Prophet
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime, timedelta
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TrendAnalyzer:
    def __init__(self):
        self.pytrends = TrendReq()
        self.scaler = MinMaxScaler()
        
    def fetch_trend_data(self, keywords, timeframe="today 12-m"):
        """
        Fetch trend data for specific keywords and process it for analysis
        """
        try:
            logger.info(f"Fetching trend data for keywords: {keywords}")
            self.pytrends.build_payload(kw_list=keywords, timeframe=timeframe)
            trend_data = self.pytrends.interest_over_time()
            
            if trend_data.empty:
                logger.warning("No trend data received")
                return None
                
            # Process data for each keyword
            processed_data = {}
            for keyword in keywords:
                if keyword in trend_data.columns:
                    df = trend_data.reset_index()[["date", keyword]]
                    df.columns = ["ds", "y"]
                    # Remove any NaN values
                    df = df.dropna()
                    if not df.empty:
                        processed_data[keyword] = df
                        logger.info(f"Successfully processed data for {keyword}")
                    else:
                        logger.warning(f"No valid data for {keyword}")
                        
            return processed_data
            
        except Exception as e:
            logger.error(f"Error fetching trend data: {str(e)}")
            return None
    
    def train_prediction_models(self, processed_data):
        """
        Train Prophet models for each keyword
        """
        if not processed_data:
            logger.error("No processed data available for training")
            return None, None
            
        models = {}
        forecasts = {}
        
        try:
            for keyword, df in processed_data.items():
                logger.info(f"Training model for {keyword}")
                
                model = Prophet(
                    changepoint_prior_scale=0.05,
                    seasonality_prior_scale=10,
                    yearly_seasonality=True,
                    weekly_seasonality=True,
                    daily_seasonality=False
                )
                
                # Add custom seasonality
                model.add_seasonality(
                    name='monthly',
                    period=30.5,
                    fourier_order=5
                )
                
                model.fit(df)
                
                # Predict next 30 days
                future = model.make_future_dataframe(periods=30)
                forecast = model.predict(future)
                
                models[keyword] = model
                forecasts[keyword] = forecast
                
                logger.info(f"Successfully trained model for {keyword}")
                
            return models, forecasts
            
        except Exception as e:
            logger.error(f"Error training models: {str(e)}")
            return None, None


    def get_trend_insights(self, forecasts):
        """
        Extract actionable insights from forecasts
        """
        if not forecasts:
            logger.error("No forecast data available for insights")
            return None
            
        insights = {}
        current_date = datetime.now()
        
        try:
            for keyword, forecast in forecasts.items():
                # Get only future predictions
                future_trends = forecast[forecast['ds'] > current_date]
                
                if not future_trends.empty:
                    max_index = future_trends['yhat'].idxmax()
                    current_value = future_trends['yhat'].iloc[0]
                    predicted_value = future_trends['yhat'].iloc[-1]
                    growth_rate = ((predicted_value - current_value) / current_value) * 100
                    
                    # Calculate new metrics
                    predicted_popularity = predicted_value  # Predicted Popularity
                    estimated_search_volume = predicted_value * 10000  # Estimated Search Volume (scaled for example)
                    
                    insights[keyword] = {
                        'peak_day': future_trends.loc[max_index, 'ds'].strftime('%Y-%m-%d'),
                        'trend_direction': 'increasing' if predicted_value > current_value else 'decreasing',
                        'growth_rate': round(growth_rate, 2),
                        'volatility': future_trends['yhat'].std(),
                        'current_value': round(current_value, 2),
                        'predicted_value': round(predicted_value, 2),
                        'predicted_popularity': round(predicted_popularity, 2),
                        'estimated_search_volume': round(estimated_search_volume, 2)
                    }
                    logger.info(f"Generated insights for {keyword}")
                    
            return insights
            
        except Exception as e:
            logger.error(f"Error generating insights: {str(e)}")
            return None

    def generate_ad_recommendations(self, insights):
        """
        Convert trend insights into actionable ad recommendations
        """
        if not insights:
            logger.error("No insights available for recommendations")
            return None
            
        recommendations = []
        
        try:
            for keyword, insight in insights.items():
                rec = {
                    'keyword': keyword,
                    'timing': f"Schedule ad campaign leading up to {insight['peak_day']}",
                    'trend_metrics': {
                        'current_value': insight['current_value'],
                        'predicted_value': insight['predicted_value'],
                        'growth_rate': insight['growth_rate'],
                        'predicted_popularity': insight['predicted_popularity'],
                        'estimated_search_volume': insight['estimated_search_volume']
                    }
                }
                
                # Add specific recommendations based on trend direction
                if insight['trend_direction'] == 'increasing':
                    rec.update({
                        'content_suggestion': f"Capitalize on rising interest in {keyword}",
                        'budget_allocation': 'High' if insight['growth_rate'] > 10 else 'Medium',
                        'creative_direction': "Create forward-looking, trend-focused content"
                    })
                else:
                    rec.update({
                        'content_suggestion': f"Focus on differentiation and value proposition for {keyword}",
                        'budget_allocation': 'Low',
                        'creative_direction': "Emphasize unique benefits and staying power"
                    })
                
                recommendations.append(rec)
                logger.info(f"Generated recommendation for {keyword}")
                
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return None
    
def main(keywords):
    analyzer = TrendAnalyzer()
    processed_data = analyzer.fetch_trend_data(keywords)
    if processed_data:
        models, forecasts = analyzer.train_prediction_models(processed_data)
        if forecasts:
            insights = analyzer.get_trend_insights(forecasts)
            if insights:
                recommendations = analyzer.generate_ad_recommendations(insights)
                return {
                    "insights": insights,
                    "recommendations": recommendations
                }
    return {"error": "Failed to analyze trends"}

if __name__ == "__main__":
    import sys
    try:
        keywords = sys.argv[1]
        keywords = json.loads(keywords)  # Convert JSON string to Python list
        result = analyze_trends(keywords)
        print(json.dumps(result))  # Output JSON for the backend
    except Exception as e:
        print(json.dumps({"error": str(e)}))
