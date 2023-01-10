import "./App.css";
import React, { Component } from "react";
import CustomModal from "./components/Model";
import axios from 'axios';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
      todoList: []
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
    .get("http://127.0.0.1:8000/api/tasks/")
    .then(response => this.setState({todoList: response.data}))
    .catch(err => console.log(err))
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();
    if(item.id) {
      axios
        .put(`http://127.0.0.1:8000/api/tasks/${item.id}`, item)
        .then(res => this.refreshList())
    }
    axios
      .post("http://127.0.0.1:8000/api/tasks/", item)
      .then(res => this.refreshList())
  };

  handleDelete = (item) => {
    axios
        .delete(`http://127.0.0.1:8000/api/tasks/${item.id}`)
        .then(res => this.refreshList())
  };

  createItem = () => {
    const item = {
      title: "",
      modal: !this.state.modal,
    };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    } else {
      return this.setState({ viewCompleted: false });
    }
  };

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          Completed
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          Incompleted
        </span>
      </div>
    );
  };

  // rendering items in the list (completed || incompleted)
  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item) => item.completed == viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center "
      >
        <span
          className={`todo-title mr-2 w-50 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.title}
        >
          {item.title}
        </span>
        <div className="w-35 d-flex justify-content-between">

        <button className="btn btn-info " onClick={(item) => this.editItem(item)}>Edit</button>
        <button className="btn btn-danger" onClick={() => this.handleDelete()}>Delete</button>
        </div>
      </li>
    ));
  };

  render() {
    return (
      <main className="content p-3 mb-2 bg-info">
        <h1 className="text-white txt-uppercase text-center my-4">
          Task Manager
        </h1>
        <div className="row">
          <div className="col-md-6 col-sma-10 mx-auto p-0">
            <div className="card p-3">
              <div>
                <button type="button" className="btn btn-warning" onClick={() => this.toggle()}>
                  Add Task
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        <footer className="my-5 mb-2 bg-info text-white text-center">
          Compyright 2023 &copy; All rights reserved!
        </footer>
        {this.state.modal ? (
          <CustomModal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleSubmit} />
        ) : null}
      </main>
    );
  }
}

export default App;
