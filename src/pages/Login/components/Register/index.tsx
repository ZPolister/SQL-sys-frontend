import React, {useRef, useState} from 'react';
import classnames from 'classnames';
import {Button, Checkbox, Form, FormInstanceFunctions, Input, MessagePlugin, SubmitContext} from 'tdesign-react';
import {BrowseIcon, BrowseOffIcon, LockOnIcon, MailIcon} from 'tdesign-icons-react';
import useCountdown from '../../hooks/useCountDown';

import Style from './index.module.less';

const {FormItem} = Form;

export type ERegisterType = 'phone' | 'email';

export default function Register() {
  const [registerType, changeRegisterType] = useState('phone');
  const [showPsw, toggleShowPsw] = useState(false);
  const {countdown, setupCountdown} = useCountdown(60);
  const formRef = useRef<FormInstanceFunctions>();

  const onSubmit = (e: SubmitContext) => {
    if (e.validateResult === true) {
      const {checked} = formRef.current?.getFieldsValue?.(['checked']) as { checked: boolean };
      if (!checked) {
        MessagePlugin.error('请同意 TDesign 服务协议和 TDesign 隐私声明');
        return;
      }
      MessagePlugin.success('注册成功');
    }
  };

  return (
    <div>
      <Form
        ref={formRef}
        className={classnames(Style.itemContainer, `register-${registerType}`)}
        labelWidth={0}
        onSubmit={onSubmit}
      >
        <FormItem
          name='email'
          rules={[
            {required: true, message: '邮箱必填', type: 'error'},
            {email: true, message: '请输入正确的邮箱', type: 'warning'},
          ]}
        >
          <Input type='text' size='large' placeholder='请输入您的邮箱' prefixIcon={<MailIcon/>}/>
        </FormItem>

        <FormItem name='password' rules={[{required: true, message: '密码必填', type: 'error'}]}>
          <Input
            size='large'
            type={showPsw ? 'text' : 'password'}
            clearable
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

        <FormItem className={Style.checkContainer} name='checked' initialData={false}>
          <Checkbox>我已阅读并同意 </Checkbox> <span className='tip'>TDesign服务协议</span> 和
          <span className='tip'>TDesign 隐私声明</span>
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
