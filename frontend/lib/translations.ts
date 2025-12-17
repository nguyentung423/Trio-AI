/**
 * translations.ts
 *
 * File chứa các bản dịch VI/EN cho toàn bộ ứng dụng
 * Updated: SaaS Commercial Version
 */

export type Language = "vi" | "en";

export const translations = {
  vi: {
    // Navbar
    nav: {
      home: "Trang chủ",
      forecast: "Dự báo",
      results: "Độ tin cậy",
      compare: "Rủi ro",
      explain: "Phương pháp",
      faculty: "Khoa Công nghệ Nông nghiệp",
      university: "ĐH Công nghệ - ĐHQGHN",
      facultyShort: "FAT - UET",
    },

    // Home page - Commercial SaaS
    home: {
      title: "Ra quyết định chính xác hơn",
      subtitle:
        "AI phân tích 35 năm dữ liệu khí hậu để giúp doanh nghiệp và nông dân giảm rủi ro, tối ưu kế hoạch mùa vụ.",
      accuracy: "Độ tin cậy",
      bestYear: "Dự báo chính xác nhất",
      weatherData: "Năm dữ liệu",
      years: "năm",
      errorAbout: "Sai số khoảng",
      vsActual: "so với thực tế",
      errorOnly: "Sai số chỉ",
      nearPerfect: "gần như hoàn hảo!",
      from: "Từ năm",
      to: "đến",
      newFeature: "AI Decision Tool",
      forecast2026: "Xem dự báo năm tới",
      forecast2026Desc:
        "Ra quyết định nhanh hơn, giảm rủi ro thị trường và tối ưu hợp đồng xuất khẩu.",
      resultsTitle: "Xem độ tin cậy",
      resultsDesc: "Mô hình duy trì sai số dưới 6% trong 6 năm liên tiếp.",
      compareTitle: "Đánh giá rủi ro",
      compareDesc: "Khi nào nên cẩn trọng? Năm nào biến động lớn?",
      explainTitle: "Phương pháp",
      explainDesc: "Hiểu cách hệ thống hoạt động và độ tin cậy.",
      disclaimer: "Kết quả mang tính",
      reference: "tham khảo",
      basedOn: "dựa trên dữ liệu thời tiết lịch sử.",
      learnMore: "Xem phương pháp →",
      recentResults: "Thành tích dự báo",
      year: "Năm",
      error: "Sai số",
    },

    // Forecast page - Decision Tool
    forecast: {
      title: "Dự báo năng suất cà phê",
      subtitle: "Công cụ hỗ trợ ra quyết định cho doanh nghiệp và nông dân",
      backHome: "← Quay lại",
      selectScenario: "Chọn kịch bản",
      elNino: "El Niño (Hạn)",
      laNina: "La Niña (Mưa)",
      drought: "Hạn hán nặng",
      ideal: "Năm lý tưởng",
      adjustInputs: "Điều chỉnh chi tiết",
      calculate: "Xem dự báo",
      calculating: "Đang phân tích...",
      result: "Dự báo năng suất",
      yield: "Năng suất dự kiến",
      range: "Khoảng dao động",
      premium: "Enterprise",
      premiumDesc:
        "Dự báo chuyên sâu cho doanh nghiệp xuất khẩu. Tối ưu hợp đồng tương lai, giảm rủi ro giá.",
    },

    // Results page - Trust & Proof
    results: {
      title: "Độ tin cậy của hệ thống",
      subtitle: "Hiệu suất dự báo đã được kiểm chứng",
      backHome: "← Quay lại",
      actual: "Thực tế",
      predicted: "Dự báo",
      error: "Sai số",
      clickYear: "Chạm để xem chi tiết",
    },

    // Compare page - Risk Assessment
    compare: {
      title: "Đánh giá rủi ro",
      subtitle: "Khi nào bạn nên cẩn trọng?",
      backHome: "← Quay lại",
      rank: "Hạng",
      year: "Năm",
      actual: "Thực tế",
      predicted: "Dự báo",
      error: "Sai số",
      status: "Mức độ",
      good: "Ổn định",
      medium: "Cẩn trọng",
      poor: "Rủi ro cao",
    },

    // Explain page - Methodology
    explain: {
      title: "Phương pháp dự báo",
      subtitle: "Hiểu cách hệ thống hoạt động",
      backHome: "← Quay lại",
      modelLearning: "Nguồn dữ liệu",
      modelDesc:
        "Hệ thống phân tích 35 năm dữ liệu khí hậu và tìm quy luật tác động đến năng suất.",
      importantNotes: "Lưu ý khi sử dụng",
      factors: "Yếu tố quan trọng",
      process: "Quy trình",
      weather: "Khí hậu",
      analysis: "Phân tích",
      prediction: "Dự báo",
      faq: "Câu hỏi thường gặp",
      summary: "Tóm tắt",
    },

    // Footer
    footer: {
      projectName: "Coffee Yield Prediction",
      projectDesc:
        "Hệ thống dự báo năng suất cà phê Robusta tỉnh Đắk Lắk sử dụng Machine Learning và dữ liệu khí hậu 35 năm.",
      dataSources: "Nguồn dữ liệu",
      weather: "Thời tiết",
      radiation: "Bức xạ",
      yield: "Năng suất",
      statistics: "Tổng cục Thống kê",
      contact: "Liên hệ",
      faculty: "Khoa CNNN - ĐH Công nghệ, ĐHQGHN",
      copyright: "Dự án nghiên cứu khoa học.",
      explainModel: "Giải thích mô hình",
      builtWith: "Built with Next.js + XGBoost",
    },

    // Common
    common: {
      loading: "Đang tải...",
      error: "Có lỗi xảy ra",
      retry: "Thử lại",
      close: "Đóng",
      tonPerHa: "tấn/ha",
    },
  },

  en: {
    // Navbar
    nav: {
      home: "Home",
      forecast: "Forecast",
      results: "Reliability",
      compare: "Risk",
      explain: "Method",
      faculty: "Faculty of Agricultural Technology",
      university: "VNU University of Engineering & Technology",
      facultyShort: "FAT - UET",
    },

    // Home page - Commercial SaaS
    home: {
      title: "Make better decisions",
      subtitle:
        "AI analyzes 35 years of climate data to help businesses and farmers reduce risk and optimize planning.",
      accuracy: "Reliability",
      bestYear: "Best prediction",
      weatherData: "Years of data",
      years: "years",
      errorAbout: "Error about",
      vsActual: "vs actual",
      errorOnly: "Error only",
      nearPerfect: "near perfect!",
      from: "From",
      to: "to",
      newFeature: "AI Decision Tool",
      forecast2026: "See Next Year Forecast",
      forecast2026Desc:
        "Decide faster, reduce market risk, optimize export contracts.",
      resultsTitle: "View Reliability",
      resultsDesc: "Model maintains under 6% error for 6 consecutive years.",
      compareTitle: "Risk Assessment",
      compareDesc: "When to be cautious? Which years had high volatility?",
      explainTitle: "Methodology",
      explainDesc: "Understand how the system works and its reliability.",
      disclaimer: "Results are for",
      reference: "reference",
      basedOn: "based on historical weather data.",
      learnMore: "View methodology →",
      recentResults: "Track Record",
      year: "Year",
      error: "Error",
    },

    // Forecast page - Decision Tool
    forecast: {
      title: "Coffee Yield Forecast",
      subtitle: "Decision support tool for businesses and farmers",
      backHome: "← Back",
      selectScenario: "Select scenario",
      elNino: "El Niño (Dry)",
      laNina: "La Niña (Wet)",
      drought: "Severe drought",
      ideal: "Ideal year",
      adjustInputs: "Adjust details",
      calculate: "View Forecast",
      calculating: "Analyzing...",
      result: "Yield Forecast",
      yield: "Expected yield",
      range: "Range",
      premium: "Enterprise",
      premiumDesc:
        "Advanced forecasting for export businesses. Optimize futures, reduce price risk.",
    },

    // Results page - Trust & Proof
    results: {
      title: "System Reliability",
      subtitle: "Verified prediction performance",
      backHome: "← Back",
      actual: "Actual",
      predicted: "Predicted",
      error: "Error",
      clickYear: "Tap for details",
    },

    // Compare page - Risk Assessment
    compare: {
      title: "Risk Assessment",
      subtitle: "When should you be cautious?",
      backHome: "← Back",
      rank: "Rank",
      year: "Year",
      actual: "Actual",
      predicted: "Predicted",
      error: "Error",
      status: "Level",
      good: "Stable",
      medium: "Caution",
      poor: "High Risk",
    },

    // Explain page - Methodology
    explain: {
      title: "Forecasting Methodology",
      subtitle: "Understand how the system works",
      backHome: "← Back",
      modelLearning: "Data sources",
      modelDesc:
        "The system analyzes 35 years of climate data to discover patterns affecting yield.",
      importantNotes: "Usage notes",
      factors: "Key factors",
      process: "Process",
      weather: "Climate",
      analysis: "Analysis",
      prediction: "Forecast",
      faq: "FAQ",
      summary: "Summary",
    },

    // Footer
    footer: {
      projectName: "Coffee Yield Prediction",
      projectDesc:
        "Robusta coffee yield prediction system for Đắk Lắk province using Machine Learning and 35 years of climate data.",
      dataSources: "Data sources",
      weather: "Weather",
      radiation: "Radiation",
      yield: "Yield",
      statistics: "General Statistics Office",
      contact: "Contact",
      faculty: "FAT - VNU University of Engineering & Technology",
      copyright: "Research project.",
      explainModel: "Explain model",
      builtWith: "Built with Next.js + XGBoost",
    },

    // Common
    common: {
      loading: "Loading...",
      error: "An error occurred",
      retry: "Retry",
      close: "Close",
      tonPerHa: "ton/ha",
    },
  },
};

export type Translations = typeof translations.vi;
