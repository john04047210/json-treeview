import React from 'react';
import ReactDOM from 'react-dom';

class TreeViewChild extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      parents: props.parents.slice() || []
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.handlePlus = this.handlePlus.bind(this);
    this.handleMinus = this.handleMinus.bind(this);
  }

  // 新しいパラメータがロードしたコンポーネントにパスされると、実行する。
  componentWillReceiveProps(newProps) {
    this.setState({
      data:newProps.data,
      parents: newProps.parents.slice() || []
    })
  }

  handleToggle(event) {
    let idx = event.target.parentElement.dataset.index;
    let newData = this.state.data.slice();
    newData[idx].state.expand = !this.state.data[idx].state.expand;
    this.setState(()=>({data: newData}));
  }

  handleClick(event) {
    if("LI" != event.target.tagName) {
      event.preventDefault();
      return;
    }
    let node = {
      id: event.target.id,
      title: this.state.data[event.target.dataset.index].title,
      parents: this.state.parents
    }
    this.props.onClick(node);
  }

  handleChecked(event) {
    if(this.props.isCheckable) {
      let idx = event.target.parentElement.dataset.index;
      let newData = this.state.data.slice();
      newData[idx].state.checked = !this.state.data[idx].state.checked;
      this.setState(()=>({data: newData}));
    } else {
      event.preventDefault();
    }
  }

  handlePlus(event) {
    if(this.props.isEditable) {
      let idx = -1;
      if("SPAN" == event.target.tagName) {
        idx = event.target.parentElement.parentElement.parentElement.dataset.index;
      } else {
        idx = event.target.parentElement.parentElement.dataset.index;
      }
      let newData = this.state.data.slice();
      if(!newData[idx].state.expand) {
        newData[idx].state.expand = true;
      }
      newData[idx].children.push({
        id: Date.now(),
        title: 'new node',
        icon: "",
        state: {
          expand: false,
          selected: false,
          checked: false
        },
        children: []
      });
      this.setState(()=>({data: newData}));
    } else {
      event.preventDefault();
    }
  }

  handleMinus(event) {
    if(this.props.isEditable) {
      let idx = -1;
      if("SPAN" == event.target.tagName) {
        idx = event.target.parentElement.parentElement.parentElement.dataset.index;
      } else {
        idx = event.target.parentElement.parentElement.dataset.index;
      }
      let newData = this.state.data.slice();
      newData.splice(idx, 1);
      this.setState(()=>({data: newData}));
    } else {
      event.preventDefault();
    }
  }

  render() {
    let childli = this.state.data.map((node, index) => {
      let element = [];
      let active_class = node.state.selected?'list-group-item active':'list-group-item';
      let indent = [];
      let checked_class = "glyphicon";
      let edit_span = null;
      if(this.props.isCheckable) {
        checked_class = node.state.checked?"icon glyphicon glyphicon-check":"icon glyphicon glyphicon-unchecked";
      }
      if(this.props.isEditable) {
        edit_span = <div className="btn-group pull-right">
                      <button type="button" className="btn btn-default btn-xs" aria-label="Create Children" onClick={this.handlePlus}>
                        <span className="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
                      <button type="button" className="btn btn-default btn-xs" aria-label="Remove Children" onClick={this.handleMinus}>
                        <span className="glyphicon glyphicon-minus" aria-hidden="true"></span></button>
                    </div>
      }
      for(let idx=0; idx<this.props.level; idx++) {
        indent.push(<span className="indent" aria-hidden="true"></span>);
      }
      if(node.children.length > 0) {
        let parents = this.state.parents.slice();
        parents.push({id:node.id,title:node.title});
        let expand_class = node.state.expand?'icon expand-icon glyphicon glyphicon-minus':'icon expand-icon glyphicon glyphicon-plus';
        element.push(<li className={active_class} id={node.id} key={"child_"+node.id} data-index={index} onClick={this.handleClick}>
          {edit_span}{indent}
          <span className={expand_class} aria-hidden="true" onClick={this.handleToggle}></span>
          <span className={checked_class} aria-hidden="true" onClick={this.handleChecked}></span>
          <span className="icon node-icon" aria-hidden="true"></span>
          {node.title}
        </li>);
        if(node.state.expand) {
          let children_node = <TreeViewChild key={"parent_"+node.id} onClick={this.props.onClick} data={node.children} 
                      isCheckable={this.props.isCheckable} isEditable={this.props.isEditable} parents={parents} level={this.props.level+1}/>
          element.push(children_node);
        }
      } else {
        element.push(
          <li className={active_class} id={node.id} key={"child_"+node.id} data-index={index} onClick={this.handleClick}>
            {edit_span}{indent}
            <span className={checked_class} aria-hidden="true" onClick={this.handleChecked}></span>
            <span className="icon node-icon" aria-hidden="true"></span>
            {node.title}
          </li>
        )
      }
      return element;
    });
    return childli;
  }
}

class TreeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    };
    this.handleClick = this.handleClick.bind(this);
  }

  // 新しいパラメータがロードしたコンポーネントにパスされると、実行する。
  componentWillReceiveProps(newProps) {
    this.setState({
      data:newProps.data
    })
  }

  getValue() {
    return this.state.data;
  }

  handleClick(node) {
    let tmpData = this.state.data.slice();
    setSelected(tmpData, node.id);
    this.setState({data: tmpData});
    this.props.onClick(node);
  }

  render() {
    return (
      <div id='tree_root' className="treeview">
        <ul className='list-group'>
          <TreeViewChild onClick={this.handleClick} data={this.state.data} 
          isCheckable={this.props.isCheckable} isEditable={this.props.isEditable} parents={[]} level={0}/>
        </ul>
      </div>
    );
  }
}

function setSelected(data, selectId) {
  data.forEach(element => {
    if(element.id == selectId) {
      element.state.selected = true;
    } else {
      element.state.selected = false;
    }
    if(element.children.length > 0) {
      setSelected(element.children, selectId);
    }
  });
}

window.JSONTreeView = function(element, options){
  if (!(element instanceof Element)) {
    throw new Error('element should be an instance of Element');
  }
  options = options || {};
  this.element = element;
  this.options = options;
  this.init();
}

JSONTreeView.prototype = {
  // necessary since we remove the ctor property by doing a literal assignment. Without this
  // the $isplainobject function will think that this is a plain object.
  constructor: JSONTreeView,
  init: function() {
    let self = this;
    let data = this.options.data || [];
    let isCheckable = this.options.isCheckable || false;
    let isEditable = this.options.isEditable || false;
    let onClick = this.options.onClick || this.onClick;

    this.react = ReactDOM.render(
      <TreeView onClick={onClick} data={data} isCheckable={isCheckable} isEditable={isEditable}/>,
      self.element
    );
    this.callbacks = {};
  },
  onClick: function(node) {
    // TODO
    alert(node.id + ':' + node.title);
  },
  getValue: function() {
    return this.react.getValue();
  },
  setValue: function(options) {
    this.options = options;
    this.init();
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  module.exports = window.JSONTreeView;
  