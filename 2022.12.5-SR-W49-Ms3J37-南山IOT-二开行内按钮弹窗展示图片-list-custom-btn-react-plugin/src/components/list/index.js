import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Empty} from "antd";

import './index.less';

const checkImgExists = (imgurl) => {
  return new Promise(function (resolve, reject) {
    var ImgObj = new Image();
    ImgObj.src = imgurl;
    ImgObj.onload = function (res) {
      resolve(res);
    }
    ImgObj.onerror = function (err) {
      reject(err)
    }
  })
}

const List = (props) => {
  let {
    dataSource,
      customParams,
      dataId,
      deleteData
  } = props;
  const width = customParams?.width || 520; 
  const height = customParams?.height || 240; 
  const [modalVisible, setModalVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [emptyStr, setEmptyStr] = useState(false);

  useEffect(() => {
    handleClick();
  }, [])

  const handleClick = () => {
    setModalVisible(true);
    getImgUrl()
  }

  const getImgUrl = () => {
    const imgSrc = customParams?.imgSrc;
    let str = ''
    dataSource.forEach(el => {
      if (el.id == imgSrc) {
        str = el.value.value
      }
    });
    if (str === '' || str.trim() === '') {
      return false;
    }
    imgSets(str)
  }

  const imgSets = (str) =>{
    checkImgExists(str).then(res => {
      console.log('有效', str);
      setImgUrl(str)
    }).catch(err => {
      console.log('无效', err);
      // let strList = str.split(':')
      // if (strList[0] !== 'data' && strList[0] !== 'https') {
      //   str = 'data:image/png;base64,' + str;
      //   imgSets(str)
      // }else {
        setEmptyStr(true)
      // }
    })
  }

  return (
    <Modal title="图片展示" visible={modalVisible} footer={null} onCancel={() => setModalVisible(false)} className="tranfer-table-filter-modal" width={width}>
      { emptyStr 
        ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无图片" />
      : <img className="previewImg" style={{ height: height + 'px' }} src={imgUrl} alt=""/>
      }
    </Modal>
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
