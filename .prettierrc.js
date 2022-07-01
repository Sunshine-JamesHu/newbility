module.exports = {
  printWidth: 150, //一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 2, //一个tab代表几个空格数，默认为80
  useTabs: false, //是否使用tab进行缩进，默认为false，表示用空格进行缩减
  singleQuote: true, //字符串是否使用单引号，默认为false，使用双引号
  semi: true, //行位是否使用分号，默认为true
  trailingComma: 'es5', //是否使用尾逗号，有三个可选值"<none|es5|all>"
  bracketSpacing: true, //对象大括号直接是否有空格，默认为true，效果：{ foo: bar }

  // eslintIntegration: true,
  // printWidth: 150, // 每行代码长度（默认80）
  // tabWidth: 2, // 每个tab相当于多少个空格（默认2）
  // useTabs: false, // 是否使用tab进行缩进（默认false）
  // singleQuote: true, // 使用单引号（默认false）
  // semi: true, // 声明结尾使用分号(默认true)
  // trailingComma: 'none', // 多行使用拖尾逗号（默认none）
  // bracketSpacing: true, // 对象字面量的大括号间使用空格（默认true）
  // jsxBracketSameLine: false, // 多行JSX中的>放置在最后一行的结尾，而不是另起一行（默认false）
  // arrowParens: 'avoid' // 只有一个参数的箭头函数的参数是否带圆括号（默认avoid）
};
