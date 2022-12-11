import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomeFooter from '../../../components/footer/HomeFooter'
import HomePageHeader from '../components/header/HomePageHeader'
import HomePage from './home-page/HomePage'
import HTXPage from './htx'
import HTXDeatailPage from './htx/detail'
import LohangPage from './rice'
import TracingPricePage from './rice/tracing'

const index = () => {
  return (
    <>
      <HomePageHeader></HomePageHeader>
      <Routes>
        <Route path='/' element={<HomePage></HomePage>}></Route>
        <Route path='/htx' element={<HTXPage></HTXPage>}></Route>
        <Route path='/htx/:id' element={<HTXDeatailPage></HTXDeatailPage>}></Route>
        <Route path='/htx/lohang/:id' element={<TracingPricePage></TracingPricePage>}></Route>
        <Route path='/lohang' element={<LohangPage></LohangPage>}></Route>
      </Routes>
      <HomeFooter></HomeFooter>
    </>
  );
};

export default index;
