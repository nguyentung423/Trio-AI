/**
 * scenarioContent.ts
 *
 * Mapping nội dung giải thích và gợi ý canh tác theo kịch bản thời tiết
 * Dùng cho trang /forecast - chỉ áp dụng cho cà phê Đắk Lắk
 */

export type ScenarioContentKey =
  | "normal"
  | "favorable"
  | "el_nino"
  | "la_nina"
  | "severe_drought"
  | "major_storm";

export interface ScenarioContent {
  why: {
    vi: string[];
    en: string[];
  };
  actions: {
    vi: string[];
    en: string[];
  };
}

// Map UI scenario ID to content key
export const scenarioIdToContentKey: Record<string, ScenarioContentKey> = {
  baseline: "normal",
  favorable: "favorable",
  "el-nino": "el_nino",
  "la-nina": "la_nina",
  drought: "severe_drought",
  storm: "major_storm",
};

export const scenarioContentMap: Record<ScenarioContentKey, ScenarioContent> = {
  normal: {
    why: {
      vi: [
        "Lượng mưa và nhiệt độ dự kiến ở mức trung bình nhiều năm",
        "Không có hiện tượng thời tiết cực đoan đáng kể",
        "Điều kiện thuận lợi cho cây cà phê phát triển ổn định",
      ],
      en: [
        "Rainfall and temperature expected at multi-year averages",
        "No significant extreme weather events predicted",
        "Favorable conditions for stable coffee growth",
      ],
    },
    actions: {
      vi: [
        "Duy trì lịch bón phân và tưới nước theo quy trình chuẩn",
        "Theo dõi sâu bệnh định kỳ, đặc biệt rệp sáp và bọ xít",
        "Chuẩn bị thu hoạch đúng độ chín để đảm bảo chất lượng",
      ],
      en: [
        "Maintain standard fertilization and irrigation schedule",
        "Monitor pests regularly, especially mealybugs and stink bugs",
        "Prepare for harvest at optimal ripeness for quality",
      ],
    },
  },
  favorable: {
    why: {
      vi: [
        "Mưa phân bố đều trong mùa sinh trưởng (tháng 5-9)",
        "Nhiệt độ ổn định, ít ngày nắng nóng trên 33°C",
        "Độ ẩm đất tốt giúp cây hấp thu dinh dưỡng hiệu quả",
      ],
      en: [
        "Well-distributed rainfall during growing season (May-Sep)",
        "Stable temperatures, few days above 33°C",
        "Good soil moisture helps efficient nutrient absorption",
      ],
    },
    actions: {
      vi: [
        "Tăng cường bón phân để tận dụng điều kiện thuận lợi",
        "Theo dõi nấm bệnh do độ ẩm cao (rỉ sắt, thán thư)",
        "Cân nhắc mở rộng diện tích hoặc trồng xen canh",
        "Đầu tư cải thiện hệ thống sơ chế sau thu hoạch",
      ],
      en: [
        "Increase fertilization to leverage favorable conditions",
        "Monitor fungal diseases due to high humidity (rust, anthracnose)",
        "Consider expanding area or intercropping",
        "Invest in post-harvest processing improvements",
      ],
    },
  },
  el_nino: {
    why: {
      vi: [
        "El Niño gây hạn hán kéo dài, thiếu nước nghiêm trọng tháng 2-4",
        "Nhiệt độ cao hơn bình thường, stress nhiệt cho cây",
        "Giảm năng suất 8-15% so với năm bình thường",
      ],
      en: [
        "El Niño causes prolonged drought, severe water shortage in Feb-Apr",
        "Higher than normal temperatures, heat stress for plants",
        "8-15% yield reduction compared to normal years",
      ],
    },
    actions: {
      vi: [
        "Tưới tiết kiệm: nhỏ giọt hoặc phun mưa vào sáng sớm/chiều tối",
        "Phủ gốc bằng rơm rạ hoặc lá khô để giữ ẩm đất",
        "Giảm 20-30% lượng phân đạm, tăng kali để tăng khả năng chịu hạn",
        "Tỉa bớt cành nhánh để giảm thoát hơi nước",
      ],
      en: [
        "Water-saving irrigation: drip or sprinkler in early morning/late evening",
        "Mulch with straw or dry leaves to retain soil moisture",
        "Reduce nitrogen by 20-30%, increase potassium for drought resistance",
        "Prune branches to reduce water evaporation",
      ],
    },
  },
  la_nina: {
    why: {
      vi: [
        "La Niña gây mưa nhiều, ngập úng cục bộ ở vùng trũng",
        "Độ ẩm cao tạo điều kiện cho nấm bệnh phát triển",
        "Giảm năng suất 5-10% do rụng hoa và quả non",
      ],
      en: [
        "La Niña causes heavy rain, local flooding in low-lying areas",
        "High humidity creates conditions for fungal diseases",
        "5-10% yield reduction due to flower and young fruit drop",
      ],
    },
    actions: {
      vi: [
        "Khơi thông rãnh thoát nước, tránh ngập úng gốc cây",
        "Phun phòng nấm rỉ sắt và thán thư định kỳ 15-20 ngày",
        "Bổ sung canxi và magie để tăng sức đề kháng",
        "Thu hoạch sớm nếu dự báo mưa lớn kéo dài",
      ],
      en: [
        "Clear drainage channels to prevent root waterlogging",
        "Spray fungicide for rust and anthracnose every 15-20 days",
        "Supplement calcium and magnesium to boost resistance",
        "Harvest early if prolonged heavy rain is forecasted",
      ],
    },
  },
  severe_drought: {
    why: {
      vi: [
        "Hạn hán nghiêm trọng: thiếu hụt nước >40% so với trung bình",
        "Nhiều ngày liên tiếp nhiệt độ trên 35°C gây cháy lá",
        "Dự kiến giảm năng suất 15-25%, một số vườn có thể mất trắng",
      ],
      en: [
        "Severe drought: water deficit >40% compared to average",
        "Consecutive days above 35°C causing leaf burn",
        "Expected 15-25% yield loss, some farms may face total loss",
      ],
    },
    actions: {
      vi: [
        "Ưu tiên tưới cho cây đang mang quả, bỏ qua cây già/yếu",
        "Che phủ 50-70% tán cây bằng lưới đen để giảm bốc hơi",
        "Ngừng bón phân hoàn toàn trong giai đoạn hạn nặng",
        "Liên hệ chính quyền địa phương về hỗ trợ thiên tai",
      ],
      en: [
        "Prioritize irrigation for fruit-bearing trees, skip old/weak ones",
        "Cover 50-70% canopy with shade net to reduce evaporation",
        "Stop fertilization completely during severe drought",
        "Contact local authorities for disaster relief support",
      ],
    },
  },
  major_storm: {
    why: {
      vi: [
        "Bão lớn gây gãy đổ cành, rụng quả hàng loạt",
        "Ngập úng kéo dài sau bão làm thối rễ",
        "Dự kiến giảm năng suất 12-20% tùy mức độ thiệt hại",
      ],
      en: [
        "Major storm causes branch breakage, massive fruit drop",
        "Prolonged flooding after storm causes root rot",
        "Expected 12-20% yield reduction depending on damage level",
      ],
    },
    actions: {
      vi: [
        "Trước bão: chằng chống cây, thu hoạch sớm quả đã chín",
        "Sau bão: cắt tỉa cành gãy, phun thuốc phòng nấm bệnh",
        "Bón phân phục hồi (NPK + vi lượng) sau 2-3 tuần",
        "Đánh giá thiệt hại để khai báo bảo hiểm nông nghiệp",
      ],
      en: [
        "Before storm: stake trees, harvest ripe fruits early",
        "After storm: prune broken branches, spray fungicide",
        "Apply recovery fertilizer (NPK + micronutrients) after 2-3 weeks",
        "Assess damage for agricultural insurance claims",
      ],
    },
  },
};

/**
 * Get scenario content by UI scenario ID
 */
export function getScenarioContent(scenarioId: string): ScenarioContent {
  const contentKey = scenarioIdToContentKey[scenarioId] || "normal";
  return scenarioContentMap[contentKey];
}
