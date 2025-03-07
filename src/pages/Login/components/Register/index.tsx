import React, {useRef, useState} from 'react';
import classnames from 'classnames';
import {
  Button,
  Checkbox,
  DialogPlugin,
  Form,
  FormInstanceFunctions,
  Input,
  MessagePlugin,
  SubmitContext
} from 'tdesign-react';
import {BrowseIcon, BrowseOffIcon, LockOnIcon, MailIcon, UserIcon, VerifyIcon} from 'tdesign-icons-react';
import useCountdown from '../../hooks/useCountDown';

import Style from './index.module.less';
import {$app} from "../../../../app/app";

const {FormItem} = Form;


export default function Register(
  {handleSwitchLoginType}: { handleSwitchLoginType: () => void }
) {
  const [showPsw, toggleShowPsw] = useState(false);
  const {countdown, setupCountdown} = useCountdown(60);
  const formRef = useRef<FormInstanceFunctions>();

  const handleRegister = () => {
    const formValue = formRef.current?.getFieldsValue?.(true) || {};
    $app.register(formValue.username, formValue.password, formValue.email, formValue.code)
      .then(() => {
        handleSwitchLoginType()
      })
  };

  const onSubmit = (e: SubmitContext) => {
    if (e.validateResult === true) {
      const {checked} = formRef.current?.getFieldsValue?.(['checked']) as { checked: boolean };
      if (!checked) {
        const d = DialogPlugin.confirm({
          header: '同意服务协议和隐私声明',
          body: (
            <>
              <span>我已阅读并同意</span>
              <span className='tip'>&nbsp;TTXX服务协议&nbsp;</span>
              和
              <span className='tip'>&nbsp;TTXX隐私声明&nbsp;</span>
            </>
          ),
          confirmBtn: {
            children: '我已同意',
            theme: 'primary',
          },
          cancelBtn: {
            children: '暂不同意',
          },
          onConfirm: () => {
            handleRegister();
            formRef.current?.setFieldsValue?.({checked: true});
            d.destroy();
          },
          onCancel: () => {
            d.destroy();
          },
          onClose: () => {
            d.destroy();
          },
        });
      } else {
        handleRegister();
      }
    }
  };

  // 新增验证码发送处理
  const handleSendCode = async () => {
    const formValue = formRef.current?.getFieldsValue?.(true) || {};
    const email = formValue.email;
    if (!email) {
      MessagePlugin.error('请先填写邮箱地址').finally();
      return;
    }
    setupCountdown();
    $app.sendEmailCode(email)
  };

  return (
    <div>
      <Form
        ref={formRef}
        className={classnames(Style.itemContainer, `register-phone`)}
        labelWidth={0}
        onSubmit={onSubmit}
      >
        {/* 用户名输入 */}
        <FormItem
          name="username"
          rules={[
            {required: true, message: '用户名必填'},
            {min: 4, message: '至少4个字符'},
            {max: 16, message: '最多16个字符'}
          ]}
        >
          <Input
            size="large"
            placeholder="请输入用户名"
            prefixIcon={<UserIcon/>}
          />
        </FormItem>

        <FormItem
          name='email'
          rules={[
            {required: true, message: '邮箱必填', type: 'error'},
            {email: true, message: '请输入正确的邮箱', type: 'warning'},
          ]}
        >
          <Input type='text' size='large' placeholder='请输入您的邮箱' prefixIcon={<MailIcon/>}/>
        </FormItem>

        {/* 验证码输入 */}
        <FormItem
          name="code"
          rules={[
            {required: true, message: '验证码必填'},
            {len: 6, message: '6位数字验证码'},
            {pattern: /^\d+$/, message: '必须为数字'}
          ]}
        >
          <Input
            size="large"
            placeholder="请输入邮箱验证码"
            prefixIcon={<VerifyIcon/>}
            suffix={
              <Button
                theme="primary"
                variant="text"
                disabled={countdown > 0}
                onClick={handleSendCode}
              >
                {countdown ? `${countdown}秒后重发` : '获取验证码'}
              </Button>
            }
          />
        </FormItem>

        <FormItem
          name='password'
          rules={[{required: true, message: '密码必填', type: 'error'}]}
        >
          <Input
            size='large'
            type={showPsw ? 'text' : 'password'}
            clearable
            autocomplete={"on"}
            placeholder='请输入登录密码'
            prefixIcon={<LockOnIcon/>}
            suffixIcon={
              showPsw ? (
                <BrowseIcon onClick={() => toggleShowPsw((current) => !current)}/>
              ) : (
                <BrowseOffIcon onClick={() => toggleShowPsw((current) => !current)}/>
              )
            }
          />
        </FormItem>

        <FormItem
          className={Style.checkContainer}
          name='checked'
          initialData={false}
        >
          <Checkbox>我已阅读并同意</Checkbox>
          <span className='tip'>&nbsp;TTXX服务协议&nbsp;</span>
          和
          <span className='tip'>&nbsp;TTXX隐私声明&nbsp;</span>
        </FormItem>

        <FormItem>
          <Button block size='large' type='submit'>
            注册
          </Button>
        </FormItem>

      </Form>
    </div>
  );
}
