import React, {useRef, useState} from 'react';
import {Button, Form, FormInstanceFunctions, Input, Link, MessagePlugin, SubmitContext} from 'tdesign-react';
import {BrowseIcon, BrowseOffIcon, LockOnIcon, UserIcon} from 'tdesign-icons-react';
import classnames from 'classnames';

import Style from './index.module.less';
import useCountdown from "../../hooks/useCountDown";
import {$app} from "../../../../app/app";

const {FormItem} = Form;

export type WindowType = 'login' | 'forgetPwd';

export default function Login() {
  const [windowType, changeWindowType] = useState<WindowType>('login');
  const [showPsw, toggleShowPsw] = useState(false);
  const formRef = useRef<FormInstanceFunctions>();
  const {countdown, setupCountdown} = useCountdown(60);

  const onSubmit = async (e: SubmitContext) => {
    if (e.validateResult === true) {
      const formValue = formRef.current?.getFieldsValue?.(true) || {};
      $app.login(formValue.identifier, formValue.password)
    }
  };

  return (
    <div>
      <Form
        ref={formRef}
        className={classnames(Style.itemContainer, `login-${windowType}`)}
        labelWidth={0}
        onSubmit={onSubmit}
      >
        {windowType === "login" && <>
            <FormItem
                name='identifier'
                rules={[{required: true, message: '账号或邮箱必填', type: 'error'}]}
            >
                <Input size='large' placeholder='请输入账号或邮箱' prefixIcon={<UserIcon/>}></Input>
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

            <div className={classnames(Style.checkContainer, Style.rememberPwd)}>
              {/*<FormItem>*/}
              {/*    <Checkbox>*/}
              {/*        记住账号*/}
              {/*    </Checkbox>*/}
              {/*</FormItem>*/}
                <div>
                </div>
                <Link
                    className={"select-none"}
                    onClick={() => MessagePlugin.success("等似喵~")}
                    theme={"primary"}
                >
                    忘记密码？
                </Link>
            </div>
        </>}

        {windowType === "forgetPwd" && <>
            <FormItem name='phone' rules={[{required: true, message: '手机号必填', type: 'error'}]}>
                <Input maxlength={11} size='large' placeholder='请输入您的手机号' prefixIcon={<UserIcon/>}/>
            </FormItem>

            <FormItem name='verifyCode' rules={[{required: true, message: '验证码必填', type: 'error'}]}>
                <Input size='large' placeholder='请输入验证码'/>
                <Button
                    variant='outline'
                    className={Style.verificationBtn}
                    disabled={countdown > 0}
                    onClick={setupCountdown}
                >
                  {countdown === 0 ? '发送验证码' : `${countdown}秒后可重发`}
                </Button>
            </FormItem>
        </>}

        {windowType === "login" && <FormItem className={Style.btnContainer}>
            <Button block size='large' type='submit'>
                登录
            </Button>
        </FormItem>}
      </Form>
    </div>
  );
}
