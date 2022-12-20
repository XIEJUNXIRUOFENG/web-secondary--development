let list = [
   { name: "计划一", No: "2022-301D01-001" },
   { name: "计划二", No: "2022-301D02-001" },
   { name: "计划三", No: "2022-301D03-001" },
   { name: "计划四", No: "2023-301D01-001" },
];

/**
 * 编号规则(任务编号-流水号)
 * @param year 年份
 * @param unitNo 单元编号
 * @param planType 计划类型
 * @param serialNumber 任务数量
 * @param planDataList 计划列表数据
 * @param planDataField 计划列表字段
 */
export const get_NumberingRules = (year, unitNo, planType, serialNumber, planDataList, planDataField) => {
   // 工程类别
   let projectCategory = "";
   // 月份
   let number = "";
   // 根据计划类型区分
   if (planType == "大修") {
      projectCategory = "D";
      // 计算当年计划数量
      let planList = 0;
      planDataList.forEach((item) => {
         if (item[planDataField].split("-")[0] == year) {
            planList += 1;
         }
      });
      // 判断是否拼'0'
      planList + 1 < 10 ? (number = "0" + (planList + 1)) : (number = planList);
   } else {
      projectCategory = "W";
      let month = String(new Date().getMonth() + 1);
      month.length < 1 ? (number = "0" + month) : (number = month);
   }

   return `${year}-${unitNo}${projectCategory}${number}-${serialNumber}`;
}

let number = get_NumberingRules("2024", "301", "大修", "001", list, 'No');


console.log(number);
