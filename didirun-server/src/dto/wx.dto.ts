import { PickDto, Rule, RuleType } from '@midwayjs/validate';
import {SelectCommonDTO} from "./common.dto"

export class WxSubscribeAddTemplateDTO {
  @Rule(RuleType.string().required())
  tid: string;

  @Rule(RuleType.array().required())
  kidList: number[];

  @Rule(RuleType.string())
  sceneDesc?: string;
}

export class WxSubscribeDelTemplateDTO {
  @Rule(RuleType.string().required())
  priTmplId: string;
}

export class WxSubscribeTmpKeyDTO extends PickDto(WxSubscribeAddTemplateDTO, [
  'tid',
]) {}

export class WxGetpubtemplatetitlesDTO extends SelectCommonDTO {
  @Rule(RuleType.string().required())
  ids: string;
}

export class WxSubscribeSendDTO {
  @Rule(RuleType.string().required())
  touser: string;
  @Rule(RuleType.string().required())
  template_id: string;
  @Rule(RuleType.string())
  page?: string;
  @Rule(RuleType.object().required())
  data: any;
  @Rule(RuleType.string())
  miniprogram_state?: string;
  @Rule(RuleType.string())
  lang?: string;
}
