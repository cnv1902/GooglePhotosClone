import React from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import PhotoGrid from "./PhotoGrid";
import api from "../services/api";

const Favorites = () => {
  useDocumentTitle("Yêu thích - Google Photos Clone");
  
  return (
    <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card card-block card-stretch card-height">
              <div className="card-body">
                <h4>Ảnh yêu thích</h4>
                <PhotoGrid />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Favorites;

