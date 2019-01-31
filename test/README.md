## moduleExport文件夹：理解module.exports 和  export
问题的来源： export default之后如果require('xxxx')需要.default
测试：
1. module.exports = 1 require('xx.js')=1
2. module.exports.default=1 require('xx.js').default=1
3. export default = 1 require('xx.js')={default: 1},`可知default其实也就只是一个属性而已，只是export时候忽略掉了`
4. export const a = 1 require('xx.js')={a: 1}  对比第三条可以知道a和default对于require没有区别