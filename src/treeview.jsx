import React from 'react';
import ReactDOM from 'react-dom';

class TreeViewChild extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      onClick: props.onClick
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleToggle(event) {
    let idx = event.target.parentElement.dataset.index;
    this.state.data[idx].expand = !this.state.data[idx].expand;
    this.setState(this.state);
  }

  handleClick(event) {
    let node = {
      id: event.target.id,
      text: event.target.textContent
    }
    this.state.onClick(node);
  }

  render() {
    let childli = this.state.data.map((node, index) => {
        if(node.nodes.length > 0) {
          return <li id={'li_'+node.id} key={node.id} data-index={index}>
            <span className={node.expand?'glyphicon glyphicon-minus':'glyphicon glyphicon-plus'} aria-hidden="true" onClick={this.handleToggle}></span>
            <div id={node.id} className='display-block' onClick={this.handleClick}>{node.title}</div>
            <ul className={node.expand?'nav nav-pills nav-stacked indentation':'nav nav-pills nav-stacked indentation hide'}>
              <TreeViewChild onClick={this.state.onClick} data={node.nodes}/>
            </ul>
          </li>
        } else {
          return <li id={'li_'+node.id} key={node.id}>
            <div id={node.id} className='display-block' onClick={this.handleClick}>{node.title}</div></li>
        }
      });
    return (
      <div>
        {childli}
      </div>
    );
  }
}

class TreeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      onClick: props.onClick
    };
  }

  render() {
    return (
      <div id='tree_root'>
        <ul className='nav nav-pills nav-stacked'>
          <TreeViewChild onClick={this.state.onClick} data={this.state.data}/>
        </ul>
      </div>
    );
  }
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
    let onClick = this.options.onClick || this.onClick;

		this.react = ReactDOM.render(
			<TreeView onClick={onClick} data={data}/>,
			self.element
		);
		this.callbacks = {};
	},
	onClick: function(node) {
    // TODO
    alert(node.id + ':' + node.text);
	},
	setValue: function(options) {
		this.options = options;
		this.init();
	}
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  module.exports = window.JSONTreeView;
  