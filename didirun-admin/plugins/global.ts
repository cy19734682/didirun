import Vue from 'vue';
import dayjs from 'dayjs';
import { imageCenterCrop } from '@/plugins/oss';

Vue.prototype.dayjs = dayjs;
Vue.prototype.imageCenterCrop = imageCenterCrop;
