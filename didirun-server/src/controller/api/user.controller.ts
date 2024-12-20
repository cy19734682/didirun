import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { UserMobileVerifyDTO, UserUpdateDTO } from '../../dto/user.dto';
import { DefaultError } from '../../error/default.error';
import { AppMiddleware } from '../../middleware/app.middleware';
import { AliSmsService } from '../../service/ali/sms.service';
import { QQService } from '../../service/qq/qq.service';
import { ToutiaoService } from '../../service/toutiao/toutiao.service';
import { UserService } from '../../service/user.service';
import { WxappService } from '../../service/wxapp.service';
import { RiderService } from '../../service/rider.service';
import { BaseController } from '../base.controller';
import { UserEntity } from '../../entity/user.entity';

@Controller('/api/user')
export class UserController extends BaseController {
  @Inject()
  userService: UserService;

  @Inject()
  smsService: AliSmsService;

  @Inject()
  wxappService: WxappService;

  @Inject()
  qqService: QQService;

  @Inject()
  toutiaoService: ToutiaoService;

  @Inject()
  riderService: RiderService;

  @Post('/update', { middleware: [AppMiddleware] })
  @Validate()
  async update(@Body() dto: UserUpdateDTO) {
    const result = await this.userService.userModel.update(
      {
        userNo: this.ctx.userInfo.userNo,
      },
      dto
    );
    if (result.affected === 0) {
      throw new DefaultError('更新用户信息失败');
    }
    return this.responseSuccess('ok');
  }

  @Get('/info', { middleware: [AppMiddleware] })
  async info() {
    const user = await this.userService.findByNo(this.ctx.userInfo.userNo);
    return this.responseSuccess('ok', this.userService.getUserInfo(user));
  }

  @Post('/register')
  @Validate()
  async register(@Body() dto: UserMobileVerifyDTO) {
    // 验证短信
    await this.smsService.doVerifyCode(dto.verifyCode, dto.mobileNumber);
    // 查询用户
    let mobileUser: UserEntity & { isRider?: boolean } =
      await this.userService.findByMobile(dto.mobileNumber);
    if (!mobileUser) {
      await this.userService.add('86', dto.mobileNumber);
      mobileUser = await this.userService.findByMobile(dto.mobileNumber);
    }
    const wxappNo = this.ctx.request.header.wxappno as string;
    const qqappNo = this.ctx.request.header.qqappno as string;
    const ttappNo = this.ctx.request.header.ttappno as string;
    if (mobileUser) {
      if (mobileUser.status !== 1) {
        throw new DefaultError('该用户已被禁用，请联系管理员！');
      }
      // 查询用户是否是骑手
      mobileUser.isRider = !!(await this.riderService.isRider(
        mobileUser.userNo
      ));
      if (wxappNo) {
        const update = await this.wxappService.wxappEntity.update(
          {
            wxappNo,
          },
          {
            userNo: mobileUser.userNo,
          }
        );
        if (update.affected === 0) {
          throw new DefaultError('登录失败');
        }
        return this.responseSuccess('ok', {
          wxappNo,
          user: this.userService.getUserInfo(mobileUser),
        });
      } else if (qqappNo) {
        const update = await this.qqService.qqappEntity.update(
          {
            qqappNo,
          },
          {
            userNo: mobileUser.userNo,
          }
        );
        if (update.affected === 0) {
          throw new DefaultError('登录失败');
        }
        return this.responseSuccess('ok', {
          qqappNo,
          user: this.userService.getUserInfo(mobileUser),
        });
      } else if (ttappNo) {
        const update = await this.toutiaoService.ttappEntity.update(
          {
            ttappNo,
          },
          {
            userNo: mobileUser.userNo,
          }
        );
        if (update.affected === 0) {
          throw new DefaultError('登录失败');
        }
        return this.responseSuccess('ok', {
          ttappNo,
          user: this.userService.getUserInfo(mobileUser),
        });
      } else {
        throw new DefaultError('无app端');
      }
    } else {
      throw new DefaultError('注册失败');
    }
  }
}
