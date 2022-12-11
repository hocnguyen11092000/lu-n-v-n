import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "antd/dist/antd.less";
import ReactDOM from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import RootRouter from "./routes/RootRouter";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConfigProvider } from "antd";
import vi_VN from "antd/es/locale/vi_VN";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider locale={vi_VN}>
          <RootRouter></RootRouter>
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>
);
