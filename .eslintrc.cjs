/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['index']
      }
    ],
    // 关闭 props 解构的校验
    'vue/no-setup-props-destructure': ['off'],
    // 变量没定义，直接用报错 off关闭校验
    'no-undef': 'error'
  },
  // 配置 全局变量名 -> 解决ElMessage在*.vue中直接使用会报错的问题
  globals: {
    ElMessage: 'readonly',
    ElMessageBox: 'readonly',
    ElLoading: 'readonly'
  }
}
