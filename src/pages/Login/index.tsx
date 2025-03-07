import React, {memo, useState} from 'react';
import classNames from 'classnames';
import Login from './components/Login';
import Register from './components/Register';
import Style from './index.module.less';
import {Link} from "tdesign-react";

export default memo(() => {
  const [type, setType] = useState('login');

  const handleSwitchLoginType = () => {
    setType(type === 'register' ? 'login' : 'register');
  };

  return (
    <div className={Style.loginWrapper}>
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          minWidth: "550px",
          height: "100dvh",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(50px)",
          boxShadow: "0px 0px 20px 20px rgba(0, 0, 0, 0.15)",
        }}
      />

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
