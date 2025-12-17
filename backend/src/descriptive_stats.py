"""
descriptive_stats.py

CHƯƠNG 2.3 - THỐNG KÊ MÔ TẢ
Tính toán thống kê mô tả và vẽ biểu đồ cho dữ liệu khí hậu.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

# ========================
# CONFIG
# ========================
BASE_DIR = Path(__file__).parent.parent
DATA_EXTERNAL = BASE_DIR / "data" / "external"
DATA_PROCESSED = BASE_DIR / "data" / "processed"

# Input file
WEATHER_FILE = DATA_EXTERNAL / "weather_daklak_1990_2025.csv"

# Output files
STATS_FILE = DATA_PROCESSED / "descriptive_statistics.csv"
HIST_FILE = DATA_PROCESSED / "histogram_precipitation.png"
BOX_FILE = DATA_PROCESSED / "boxplot_precipitation.png"
BAR_FILE = DATA_PROCESSED / "barchart_mean_median.png"

# Variables to analyze
VARIABLES = [
    'temp_max',
    'temp_min',
    'rain',
    'humidity',
    'radiation',
    'soil_0_7'
]

# Variable labels for display
VARIABLE_LABELS = {
    'temp_max': 'Temperature Max (°C)',
    'temp_min': 'Temperature Min (°C)',
    'rain': 'Precipitation (mm)',
    'humidity': 'Relative Humidity (%)',
    'radiation': 'Shortwave Radiation (MJ/m²)',
    'soil_0_7': 'Soil Moisture 0-7cm (m³/m³)'
}

# ========================
# MAIN
# ========================
def main():
    # 1. Load data
    df = pd.read_csv(WEATHER_FILE)
    
    # 2. Calculate descriptive statistics
    stats_list = []
    for var in VARIABLES:
        if var in df.columns:
            stats_list.append({
                'Variable': var,
                'Mean': round(df[var].mean(), 4),
                'Median': round(df[var].median(), 4),
                'Std': round(df[var].std(), 4)
            })
    
    stats_df = pd.DataFrame(stats_list)
    
    # 3. Save statistics to CSV
    stats_df.to_csv(STATS_FILE, index=False)
    
    # 4. Create histogram for precipitation (rain)
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.hist(df['rain'].dropna(), bins=50, color='steelblue', edgecolor='white')
    ax.set_xlabel('Precipitation (mm)', fontsize=11)
    ax.set_ylabel('Frequency', fontsize=11)
    ax.set_title('Histogram of Daily Precipitation (1990-2024)', fontsize=12)
    ax.grid(True, alpha=0.3, axis='y')
    plt.tight_layout()
    plt.savefig(HIST_FILE, dpi=150)
    plt.close()
    
    # 5. Create boxplot for precipitation (rain)
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.boxplot(df['rain'].dropna(), vert=True, patch_artist=True,
               boxprops=dict(facecolor='steelblue', alpha=0.7),
               medianprops=dict(color='darkred', linewidth=2))
    ax.set_ylabel('Precipitation (mm)', fontsize=11)
    ax.set_title('Boxplot of Daily Precipitation (1990-2024)', fontsize=12)
    ax.set_xticklabels(['precipitation'])
    ax.grid(True, alpha=0.3, axis='y')
    plt.tight_layout()
    plt.savefig(BOX_FILE, dpi=150)
    plt.close()
    
    # 6. Create bar chart comparing Mean vs Median
    fig, ax = plt.subplots(figsize=(10, 6))
    
    x = np.arange(len(stats_df))
    width = 0.35
    
    bars1 = ax.bar(x - width/2, stats_df['Mean'], width, label='Mean', color='steelblue')
    bars2 = ax.bar(x + width/2, stats_df['Median'], width, label='Median', color='coral')
    
    ax.set_xlabel('Variable', fontsize=11)
    ax.set_ylabel('Value', fontsize=11)
    ax.set_title('Comparison of Mean vs Median for Climate Variables', fontsize=12)
    ax.set_xticks(x)
    ax.set_xticklabels(stats_df['Variable'], rotation=15, ha='right')
    ax.legend()
    ax.grid(True, alpha=0.3, axis='y')
    
    # Add value labels on bars
    for bar in bars1:
        height = bar.get_height()
        ax.annotate(f'{height:.2f}',
                    xy=(bar.get_x() + bar.get_width()/2, height),
                    xytext=(0, 3), textcoords='offset points',
                    ha='center', va='bottom', fontsize=8)
    for bar in bars2:
        height = bar.get_height()
        ax.annotate(f'{height:.2f}',
                    xy=(bar.get_x() + bar.get_width()/2, height),
                    xytext=(0, 3), textcoords='offset points',
                    ha='center', va='bottom', fontsize=8)
    
    plt.tight_layout()
    plt.savefig(BAR_FILE, dpi=150)
    plt.close()
    
    # 7. Print results
    print("\n" + "=" * 60)
    print("DESCRIPTIVE STATISTICS")
    print("=" * 60)
    print(stats_df.to_string(index=False))
    print("=" * 60)
    print(f"\nSaved: {STATS_FILE}")
    print(f"Saved: {HIST_FILE}")
    print(f"Saved: {BOX_FILE}")
    print(f"Saved: {BAR_FILE}")
    print("\nDescriptive statistics & plots generated successfully.")


if __name__ == "__main__":
    main()
