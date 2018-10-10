import category from '@/common/utils/category'

// 初始化一级类目
const getFirstCategoryList = () => {
  let firstCategory = []
  for (let i = 0; i < category.length; i++) {
    let x = {code: category[i].code, name: category[i].name}
    firstCategory.push(x)
  }
  return firstCategory
}

// 根据一级类目获取二级类目
const getSecondByFirstCategory = firstCategory => {
  let secondCategories = []
  for (let i = 0; i < category.length; i++) {
    if (category[i].code === firstCategory) {
      let categories = category[i].categories
      if (categories != null) {
        for (let j = 0; j < categories.length; j++) {
          let x = {code: categories[j].code, name: categories[j].name}
          secondCategories.push(x)
        }
      }
    }
  }
  return secondCategories
}

const getThirdByFirstAndSecondCategory = (firstCategory, secondCategory) => {
  let thirdCategories = []
  for (let i = 0; i < category.length; i++) {
    if (category[i].code === firstCategory) {
      // 找到对应的一级类目
      let secondCategoryArr = category[i].categories
      if (secondCategoryArr != null) {
        for (let j = 0; j < secondCategoryArr.length; j++) {
          if (secondCategoryArr[j].code === secondCategory) {
            // 找到对应的二级类目
            let thirdCategoryArr = secondCategoryArr[j].categories
            // 获取对应的三级类目
            if (thirdCategoryArr != null) {
              for (let k = 0; k < thirdCategoryArr.length; k++) {
                let x = {code: thirdCategoryArr[k].code, name: thirdCategoryArr[k].name}
                thirdCategories.push(x)
              }
            }
          }
        }
      }
    }
  }
  return thirdCategories
}

// 根据三级类目来获取类目编码
const getTradeCategory = (firstCategory, secondCategory, thirdCategory) => {
  let tradeCategory = '5651'
  if ((firstCategory == null || firstCategory === '') ||
    (secondCategory == null || secondCategory === '') ||
    (thirdCategory == null || thirdCategory === '')) {
    return '000000'
  }
  for (let i = 0; i < category.length; i++) {
    if (category[i].name === firstCategory) {
      // 找到对应的一级类目
      tradeCategory = tradeCategory + category[i].code
      let secondCategoryArr = category[i].categories
      if (secondCategoryArr != null) {
        for (let j = 0; j < secondCategoryArr.length; j++) {
          if (secondCategoryArr[j].name === secondCategory) {
            // 找到对应的二级类目
            tradeCategory = tradeCategory + secondCategoryArr[j].code
            let thirdCategoryArr = secondCategoryArr[j].categories
            // 获取对应的三级类目
            if (thirdCategoryArr != null) {
              for (let k = 0; k < thirdCategoryArr.length; k++) {
                if (thirdCategoryArr[k].name === thirdCategory) {
                  tradeCategory = tradeCategory + thirdCategoryArr[k].code
                  return tradeCategory
                }
              }
            }
          }
        }
      }
    }
  }
  return '000000'
}

const getCategoryByCode = categoryCode => {
  let categoryStr = ''
  if (!categoryCode) {
    return categoryStr
  }
  let firstCategoryCode = categoryCode.substring(4, 8)
  let secondCategoryCode = categoryCode.substring(8, 12)
  let thirdCategoryCode = categoryCode.substring(12, 16)
  for (let i = 0; i < category.length; i++) {
    if (category[i].code === firstCategoryCode) {
      categoryStr = category[i].name
      // 找到对应的一级类目
      let secondCategoryArr = category[i].categories
      if (secondCategoryArr != null) {
        for (let j = 0; j < secondCategoryArr.length; j++) {
          if (secondCategoryArr[j].code === secondCategoryCode) {
            categoryStr = categoryStr + '-' + secondCategoryArr[j].name
            // 找到对应的二级类目
            let thirdCategoryArr = secondCategoryArr[j].categories
            // 获取对应的三级类目
            if (thirdCategoryArr != null) {
              for (let k = 0; k < thirdCategoryArr.length; k++) {
                if (thirdCategoryArr[k].code === thirdCategoryCode) {
                  categoryStr = categoryStr + '-' + thirdCategoryArr[k].name
                }
              }
            }
          }
        }
      }
    }
  }
  return categoryStr
}

const CategoryUtil = {
  getFirstCategoryList,
  getSecondByFirstCategory,
  getThirdByFirstAndSecondCategory,
  getTradeCategory,
  getCategoryByCode
}

export default CategoryUtil
