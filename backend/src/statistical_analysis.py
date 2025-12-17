"""
statistical_analysis.py

CHƯƠNG 3 – PHÂN TÍCH THỐNG KÊ & SUY LUẬN
- Phân nhóm dữ liệu theo SPI (hạn) và ENSO
- T-test: Hạn vs Không hạn
- ANOVA: Theo ENSO phase
"""

import pandas as pd
import numpy as np
from scipy import stats
from pathlib import Path

# ========================
# CONFIG
# ========================
BASE_DIR = Path(__file__).parent.parent
DATA_PROCESSED = BASE_DIR / "data" / "processed"
DATA_RAW = BASE_DIR / "data" / "raw"

# Input files
FEATURES_FILE = DATA_PROCESSED / "features_yearly_upgraded.csv"
YIELD_FILE = DATA_RAW / "coffee_yield_daklak.csv"

# Output files
ANALYSIS_FILE = DATA_PROCESSED / "statistical_analysis_dataset.csv"
RESULTS_FILE = DATA_PROCESSED / "statistical_test_results.csv"


# ========================
# 3.1. PHÂN NHÓM DỮ LIỆU
# ========================
def create_grouped_dataset():
    """Phân nhóm dữ liệu theo hạn và ENSO."""
    print("=" * 60)
    print("3.1. PHÂN NHÓM DỮ LIỆU")
    print("=" * 60)
    
    # Load data
    features = pd.read_csv(FEATURES_FILE)
    yields = pd.read_csv(YIELD_FILE)
    
    print(f"\n📂 Loaded features: {len(features)} years")
    print(f"📂 Loaded yields: {len(yields)} years")
    
    # A. Phân nhóm theo hạn khí tượng (SPI_MarJun)
    features['drought_group'] = features['SPI_MarJun'].apply(
        lambda x: 'Drought' if x < -0.5 else 'Non-Drought'
    )
    
    # B. Phân nhóm theo ENSO
    def classify_enso(oni):
        if oni >= 0.5:
            return 'El Niño'
        elif oni <= -0.5:
            return 'La Niña'
        else:
            return 'Neutral'
    
    features['enso_phase'] = features['ENSO_MarJun'].apply(classify_enso)
    
    # C. Merge với năng suất
    df = features.merge(yields[['year', 'yield_ton_ha']], on='year', how='inner')
    
    print(f"\n✅ Merged dataset: {len(df)} years with yield data")
    
    # Thống kê nhóm
    print("\n📊 Phân nhóm theo Hạn:")
    print(df['drought_group'].value_counts().to_string())
    
    print("\n📊 Phân nhóm theo ENSO:")
    print(df['enso_phase'].value_counts().to_string())
    
    # Save
    df.to_csv(ANALYSIS_FILE, index=False)
    print(f"\n✅ Saved: {ANALYSIS_FILE}")
    
    return df


# ========================
# 3.2. KIỂM ĐỊNH THỐNG KÊ
# ========================
def run_statistical_tests(df):
    """Thực hiện T-test và ANOVA."""
    print("\n" + "=" * 60)
    print("3.2. KIỂM ĐỊNH THỐNG KÊ")
    print("=" * 60)
    
    results = []
    alpha = 0.05
    
    # ----------------------------------------
    # A. T-TEST: HẠN vs KHÔNG HẠN
    # ----------------------------------------
    print("\n" + "-" * 60)
    print("A. T-TEST: HẠN vs KHÔNG HẠN")
    print("-" * 60)
    
    drought = df[df['drought_group'] == 'Drought']['yield_ton_ha']
    non_drought = df[df['drought_group'] == 'Non-Drought']['yield_ton_ha']
    
    mean_drought = drought.mean()
    mean_non_drought = non_drought.mean()
    
    # Welch's t-test (không giả định phương sai bằng nhau)
    t_stat, p_value = stats.ttest_ind(drought, non_drought, equal_var=False)
    
    conclusion = "Reject H0" if p_value < alpha else "Fail to reject H0"
    
    print(f"\nGiả thuyết:")
    print(f"  H0: Không có sự khác biệt về năng suất giữa năm hạn và không hạn")
    print(f"  H1: Có sự khác biệt về năng suất giữa hai nhóm")
    print(f"\nKết quả:")
    print(f"  Nhóm Hạn (n={len(drought)}):        Mean = {mean_drought:.4f} tấn/ha")
    print(f"  Nhóm Không Hạn (n={len(non_drought)}): Mean = {mean_non_drought:.4f} tấn/ha")
    print(f"  t-statistic = {t_stat:.4f}")
    print(f"  p-value     = {p_value:.4f}")
    print(f"\n  ➤ Kết luận (α=0.05): {conclusion}")
    
    if p_value < alpha:
        print(f"    → Có sự khác biệt có ý nghĩa thống kê về năng suất giữa hai nhóm.")
    else:
        print(f"    → Không đủ bằng chứng để kết luận có sự khác biệt.")
    
    results.append({
        'Test': 'T-test (Welch)',
        'Groups': 'Drought vs Non-Drought',
        'Mean_Group1': round(mean_drought, 4),
        'Mean_Group2': round(mean_non_drought, 4),
        'Statistic': round(t_stat, 4),
        'p_value': round(p_value, 4),
        'Conclusion': conclusion
    })
    
    # ----------------------------------------
    # B. ANOVA: THEO ENSO PHASE
    # ----------------------------------------
    print("\n" + "-" * 60)
    print("B. ONE-WAY ANOVA: THEO ENSO PHASE")
    print("-" * 60)
    
    el_nino = df[df['enso_phase'] == 'El Niño']['yield_ton_ha']
    la_nina = df[df['enso_phase'] == 'La Niña']['yield_ton_ha']
    neutral = df[df['enso_phase'] == 'Neutral']['yield_ton_ha']
    
    mean_el_nino = el_nino.mean() if len(el_nino) > 0 else np.nan
    mean_la_nina = la_nina.mean() if len(la_nina) > 0 else np.nan
    mean_neutral = neutral.mean() if len(neutral) > 0 else np.nan
    
    # One-way ANOVA
    groups = [g for g in [el_nino, la_nina, neutral] if len(g) > 0]
    f_stat, p_value_anova = stats.f_oneway(*groups)
    
    conclusion_anova = "Reject H0" if p_value_anova < alpha else "Fail to reject H0"
    
    print(f"\nGiả thuyết:")
    print(f"  H0: Năng suất trung bình giữa các pha ENSO là như nhau")
    print(f"  H1: Có ít nhất một nhóm khác biệt")
    print(f"\nKết quả:")
    print(f"  El Niño (n={len(el_nino)}):  Mean = {mean_el_nino:.4f} tấn/ha")
    print(f"  La Niña (n={len(la_nina)}):  Mean = {mean_la_nina:.4f} tấn/ha")
    print(f"  Neutral (n={len(neutral)}):  Mean = {mean_neutral:.4f} tấn/ha")
    print(f"  F-statistic = {f_stat:.4f}")
    print(f"  p-value     = {p_value_anova:.4f}")
    print(f"\n  ➤ Kết luận (α=0.05): {conclusion_anova}")
    
    if p_value_anova < alpha:
        print(f"    → Có sự khác biệt có ý nghĩa thống kê về năng suất giữa các pha ENSO.")
    else:
        print(f"    → Không đủ bằng chứng để kết luận có sự khác biệt giữa các pha ENSO.")
    
    # Format means for ANOVA result
    means_str = f"ElNino:{mean_el_nino:.2f}, LaNina:{mean_la_nina:.2f}, Neutral:{mean_neutral:.2f}"
    
    results.append({
        'Test': 'One-way ANOVA',
        'Groups': 'El Niño / La Niña / Neutral',
        'Mean_Group1': means_str,
        'Mean_Group2': '-',
        'Statistic': round(f_stat, 4),
        'p_value': round(p_value_anova, 4),
        'Conclusion': conclusion_anova
    })
    
    # Save results
    results_df = pd.DataFrame(results)
    results_df.to_csv(RESULTS_FILE, index=False)
    
    print("\n" + "=" * 60)
    print("BẢNG KẾT QUẢ KIỂM ĐỊNH")
    print("=" * 60)
    print(results_df.to_string(index=False))
    print("=" * 60)
    print(f"\n✅ Saved: {RESULTS_FILE}")
    
    return results_df


# ========================
# MAIN
# ========================
def main():
    print("\n" + "=" * 60)
    print("CHƯƠNG 3 – PHÂN TÍCH THỐNG KÊ & SUY LUẬN")
    print("=" * 60)
    
    # 3.1. Phân nhóm dữ liệu
    df = create_grouped_dataset()
    
    # 3.2. Kiểm định thống kê
    results = run_statistical_tests(df)
    
    print("\n" + "=" * 60)
    print("Inferential statistical analysis completed successfully.")
    print("=" * 60)


if __name__ == "__main__":
    main()
