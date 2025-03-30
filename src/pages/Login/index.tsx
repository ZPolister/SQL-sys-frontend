import React, { memo, useState, useEffect } from 'react';
import classNames from 'classnames';
import Login from './components/Login';
import Register from './components/Register';
import Style from './index.module.less';
import { Link } from "tdesign-react";
import { $app } from '../../app/app';

export default memo(() => {
  const [type, setType] = useState('login');

  const handleSwitchLoginType = () => {
    setType(type === 'register' ? 'login' : 'register');
  };

  return (
    <div className={Style.loginWrapper}>
      <div className={Style.shadowBackground} />

      <div className={Style.loginContainer}>
        <div className={Style.titleContainer}>
          <h1 className={Style.title}>登录到</h1>
          <h1 className={Style.title}>TTXX Health</h1>
          <div className={Style.subTitle}>
            <p className={classNames(Style.tip, Style.registerTip)}>
              {type === 'register' ? '已有账号?' : '没有账号吗?'}
            </p>
            <Link
              theme={"primary"}
              onClick={handleSwitchLoginType}
            >
              {type === 'register' ? '登录' : '注册新账号'}
            </Link>
          </div>
        </div>
        {type === 'login' ? <Login/> : <Register handleSwitchLoginType={handleSwitchLoginType}/>}
      </div>
      <footer className={Style.copyright}>Copyright @ 2025 TTXX. All Rights Reserved</footer>
    </div>
  );
});
