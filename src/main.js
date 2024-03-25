import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/styles/common.scss' // common css

import {
  Button,
  Divider,
  Col,
  Row,
  Dialog,
  NavBar,
  Cell,
  Icon,
  CellGroup,
  Badge ,
  Toast,
  ActionSheet,
  Form,
  Field,
  Popup,
  DatetimePicker,
  SwipeCell,
  List,
  Sticky,
  Cascader,
  RadioGroup,
  Radio,
  Picker,
  Uploader
} from 'vant';

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import 'vant/lib/index.css';

import moment from "moment";
import {
  formatDate
} from "@/utils/generator/dateTimeConfig.js";

// import FastClick from 'fastclick';
// FastClick.attach(document.body);
document.documentElement.style.fontSize = window.screen.width / 10 + 'px';

//挂载全局组件
Vue.use(Button);
Vue.use(Divider);
Vue.use(Col);
Vue.use(Row);
Vue.use(NavBar);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Icon);
Vue.use(Badge);
Vue.use(ActionSheet);
Vue.use(Form);
Vue.use(Field);
Vue.use(Popup);
Vue.use(DatetimePicker);
Vue.use(SwipeCell);
Vue.use(List);
Vue.use(Sticky);
Vue.use(Cascader);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Picker);
Vue.use(Toast);
Vue.use(Dialog);
Vue.use(Uploader);

//挂载全局方法
Vue.prototype.$moment = moment;
Vue.prototype.$formatDate = formatDate;
moment.locale('zh-cn')


// Vue.use(ElementUI)
// console.log(Button)




Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')