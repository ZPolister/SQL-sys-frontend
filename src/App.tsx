import * as React from "react"
import {useCallback, useState} from "react"
import {ConfigProvider, DialogPlugin, Layout, Link, Loading, Menu} from 'tdesign-react';
import {
  AccessibilityIcon,
  AppleIcon,
  DashboardIcon,
  LogoutIcon,
  NotificationIcon,
  SleepIcon,
  ThumbUp1Icon,
} from "tdesign-icons-react";
import Overview from "./pages/overview";
import Body from "./pages/body";
import Sport from "./pages/sport";
import Sleep from "./pages/sleep";
import Nutrition from "./pages/nutrition";
import {$app} from "./app/app";
import useLoginVM from "./hooks/useLoginVM";
import Login from "./pages/Login";

const {HeadMenu, MenuItem} = Menu;
const {Header, Content, Footer, Aside} = Layout;

interface SideMenuProps {
  selected: string;
  onSelected: (key: string) => void;
}

function SideMenu({selected, onSelected}: SideMenuProps) {
  // 将菜单项数据抽离为独立变量
  const menuItems = [
    {
      value: "overview",
      icon: <DashboardIcon/>,
      label: "总览"
    },
    {
      value: "body",
      icon: <AccessibilityIcon/>,
      label: "体征数据"
    },
    {
      value: "sport",
      icon: <ThumbUp1Icon/>,
      label: "运动数据"
    },
    {
      value: "nutrition",
      icon: <AppleIcon/>,
      label: "饮食数据"
    },
    {
      value: "sleep",
      icon: <SleepIcon/>,
      label: "睡眠数据"
    }
  ];

  // 渲染组件保持简洁
  return (
    <Menu
      theme="light"
      value={selected} // 绑定当前选中项[1](@ref)
      onChange={(value) => onSelected(String(value))} // 触发选择事件[1](@ref)
      style={{marginRight: 50}}
    >
      {menuItems.map((item) => (
        <MenuItem
          key={item.value}
          value={item.value}
          icon={item.icon}
        >
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
}

const App: React.FC = () => {
  const {state: loginState} = useLoginVM()
  const [selectedKey, setSelectedKey] = useState('overview');


  // 创建路由组件映射
  const renderContent = useCallback(() => {
    switch (selectedKey) {
      case 'overview':
        return <Overview/>;
      case 'body':
        return <Body/>;
      case 'sport':
        return <Sport/>;
      case 'nutrition':
        return <Nutrition/>;
      case 'sleep':
        return <Sleep/>;
      default:
        return <div>内容加载中...</div>;
    }
  }, [selectedKey])


  const handleNotification = () => {
    console.log('生成通知')
    $app.requestNotificationPermission()
    const n = $app.sendNotification("TTXX", "TTTTTTTTTXX")
    n?.addEventListener("click", () => {
      console.log("通知被点击")
    })
  }

  const handleLogout = () => {
    const d = DialogPlugin.confirm({
      header: "退出登录",
      body: "是否确认退出登录？",
      onConfirm: () => {
        $app.logout()
        d.destroy()
      },
      onClose: () => {
        d.destroy()
      }
    })
  }

  return (
    <ConfigProvider globalConfig={{classPrefix: 't'}}>
      <div className="tdesign-demo-item--layout h-[100dvh]">
        <Layout className={"h-full"}>

          {loginState === "logged" && <>
              <Header>
                  <HeadMenu
                      value="item1"
                      logo={(
                        <div className={"text-lg font-semibold"}>
                          TTXX健康管理平台
                        </div>
                      )}
                      operations={
                        <div className="t-menu__operations">
                          <NotificationIcon
                            className="t-menu__operations-icon"
                            onClick={handleNotification}
                          />
                          <Link
                            theme={"primary"}
                            prefixIcon={<LogoutIcon/>}
                            onClick={handleLogout}
                          >
                            退出
                          </Link>
                        </div>
                      }
                  >
                      <MenuItem value="item2">顶部</MenuItem>
                      <MenuItem value="item3">导航按钮</MenuItem>
                      <MenuItem value="item4" disabled>
                          留给你TTXX
                      </MenuItem>
                  </HeadMenu>
              </Header>

              <Layout className={"h-full relative overflow-hidden"}>

                  <Aside style={{borderTop: '1px solid var(--component-border)'}}>
                      <SideMenu
                          selected={selectedKey}
                          onSelected={setSelectedKey}
                      />
                  </Aside>

                  <Layout className={"overflow-y-scroll overflow-x-hidden"}>

                      <Content>
                        {renderContent()}
                      </Content>

                      <Footer>Copyright @ TTXX 2025. All Rights Reserved</Footer>

                  </Layout>
              </Layout>
          </>}

          {loginState === "pending" && <div
              className={"flex flex-row items-center justify-center w-full h-dvh"}
          >
              <Loading size={"small"} text={"正在验证登录..."}/>
          </div>}

          {loginState === "logout" && <>
              <Login/>
          </>}

        </Layout>
      </div>
    </ConfigProvider>
  )
}
export default App
