import React, { Component } from "react";
import CodeCellContainer from "./CodeCellContainer";
import RenderedMarkdown from "./RenderedMarkdown";

class ToggleableMarkdownContainer extends Component {
  state = {
    editable: true
  };

  render() {
    return this.state.editable ? (
      <CodeCellContainer
        language={this.props.language}
        code={this.props.code}
        onDeleteCellClick={this.props.onDeleteCellClick}
        onAddCellClick={this.props.onAddCellClick}
        cellIndex={this.props.cellIndex}
        defaultLanguage={this.props.defaultLanguage}
      />
    ) : (
      <RenderedMarkdown
        language={this.props.language}
        code={this.props.code}
        cellIndex={this.props.cellIndex}
        onDeleteCellClick={this.props.onDeleteCellClick}
        onAddCellClick={this.props.onAddCellClick}
        defaultLanguage={this.props.defaultLanguage}
      />
    );
  }
}

export default ToggleableMarkdownContainer;