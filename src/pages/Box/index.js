import React, { Component } from "react";
import socket from "socket.io-client";
import Dropzone from "react-dropzone";
import { MdInsertDriveFile } from "react-icons/md";
import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";

import "./styles.css";
import logo from "../../assets/logo.svg";

import api from "../../services/api";

export default class Box extends Component {
  state = {
    box: {}
  };

  async componentDidMount() {
    this.subscribeToNewFiles();
    const box = this.props.match.params.id;
    const response = await api.get(`boxes/${box}`);
    this.setState({ box: response.data });
  }

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket("https://omni-stack-backend.herokuapp.com");
    io.emit("connectRoom", box);
    io.on("file", data => {
      this.setState({
        box: { ...this.state.box, files: [data, ...this.state.box.files] }
      });
    });
  };

  handleUpload = files => {
    const box = this.props.match.params.id;
    files.forEach(file => {
      const data = new FormData();
      data.append("file", file);
      api.post(`boxes/${box}/files`, data);
    });
  };

  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="logo" />
          <h1>{this.state.box.title}</h1>
        </header>
        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>arraste arquivos ou clique aqui</p>
            </div>
          )}
        </Dropzone>
        <ul>
          {this.state.box.files &&
            this.state.box.files.map(file => (
              <li key={file._id}>
                <a href={file.url} target="_blank" className="fileInfo">
                  <MdInsertDriveFile size={24} color="#a5cfff" />
                  <strong>{file.title}</strong>
                </a>
                <span>
                  há{" "}
                  {distanceInWords(file.createdAt, new Date(), {
                    locale: pt
                  })}
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
