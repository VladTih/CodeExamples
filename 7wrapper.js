import BoardItem from 'components/BoardItem';
import BoardModal from 'components/Modals/BoardModal';
import PropTypes from 'prop-types';
import { Grid, Row, Button } from 'react-bootstrap';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import React from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectReducer from 'utils/injectReducer';
import {
  onDragBoard,
  onDragCard,
  onPushCard,
  deleteBoard,
  createBoard,
  toggleModal,
  setDataForEdit,
  updateBoard,
  createCard,
  editCard,
  deleteCard,
} from './actions';

import {
  makeSelectorBoards,
  makeSelectorisModalShowd,
  makeSelectorModalMod,
  makeSelectorEditData,
} from './selectors';
import reducer from './reducer';


import './style.css';

@DragDropContext(HTML5Backend)
export class DragPage extends React.PureComponent {

  handleModalToggle = () => {
    this.props.toggleModal('create board');
  }

  render() {
    return (
      <div>
        {this.props.isModalShowd ?
          <BoardModal
            editData={this.props.editData}
            toggleModal={this.props.toggleModal}
            createBoard={this.props.createBoard}
            modalMod={this.props.modalMod}
            setDataForEdit={this.props.setDataForEdit}
            updateBoard={this.props.updateBoard}
            createCard={this.props.createCard}
            editCard={this.props.editCard}
          /> : ''}
        <Grid>
          <Row>
            <h1>its a magic D&D shit</h1>
          </Row>
          <div className="board-container">
            {
              this.props.boards.map((board, index) => (
                <BoardItem
                  index={index}
                  key={board.toJS().id}
                  id={board.toJS().id}
                  boardName={board.toJS().name}
                  boardItems={board.toJS().items}
                  onDragBoard={this.props.onDragBoard}
                  onDragCard={this.props.onDragCard}
                  onPushCard={this.props.onPushCard}
                  deleteBoard={this.props.deleteBoard}
                  toggleModal={this.props.toggleModal}
                  setDataForEdit={this.props.setDataForEdit}
                  deleteCard={this.props.deleteCard}
                />
              ))
            }
          </div>
          <Row>
            <Button className="create-board-btn" onClick={this.handleModalToggle}>Create new board</Button>
          </Row>
        </Grid>
      </div>
    );
  }
}

DragPage.propTypes = {
  toggleModal: PropTypes.func,
  editData: PropTypes.object,
  createBoard: PropTypes.func,
  modalMod: PropTypes.string,
  isModalShowd: PropTypes.bool,
  setDataForEdit: PropTypes.func,
  updateBoard: PropTypes.func,
  createCard: PropTypes.func,
  editCard: PropTypes.func,
  boards: PropTypes.object,
  onDragBoard: PropTypes.func,
  onDragCard: PropTypes.func,
  onPushCard: PropTypes.func,
  deleteBoard: PropTypes.func,
  deleteCard: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onDragBoard,
    onDragCard,
    onPushCard,
    deleteBoard,
    createBoard,
    toggleModal,
    setDataForEdit,
    updateBoard,
    createCard,
    editCard,
    deleteCard,
  }, dispatch);
}

const mapStateToProps = createStructuredSelector({
  isModalShowd: makeSelectorisModalShowd(),
  boards: makeSelectorBoards(),
  modalMod: makeSelectorModalMod(),
  editData: makeSelectorEditData(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'boards', reducer });

export default compose(
  withReducer,
  withConnect,
)(DragPage);
