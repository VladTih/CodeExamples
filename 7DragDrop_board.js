import React from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import PropTypes from 'prop-types';
import DragItem from 'components/DragItem';
import { Button } from 'react-bootstrap';
import './style.css';


export const boardSource = {
  beginDrag(props) {
    return {
      boardId: props.id,
      index: props.index,
    };
  },
};

export const boardTarget = {
  hover(props, monitor, component) {
    const targetType = monitor.getItemType();
    switch (targetType) {
      case 'board': {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        if (dragIndex === hoverIndex) {
          return;
        }

        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect(); // eslint-disable-line react/no-find-dom-node

        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

        const clientOffset = monitor.getClientOffset();

        const hoverClientX = clientOffset.x - hoverBoundingRect.left;


        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
          return;
        }

        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
          return;
        }
        monitor.getItem().index = hoverIndex; // eslint-disable-line no-param-reassign
        props.onDragBoard(dragIndex, hoverIndex);
        break;
      }
      default:
    }
  },
  drop(props, monitor) {
    const targetType = monitor.getItemType();
    switch (targetType) {
      case 'card': {
        const cardIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        const sourceBoard = monitor.getItem().boardIndex;

        if (sourceBoard === hoverIndex) {
          return;
        }

        props.onPushCard(cardIndex, hoverIndex, sourceBoard);
        break;
      }
      default:
        break;
    }
  },
};

const itemType = { BOARD: 'board', CARD: 'card' };

@DropTarget([itemType.BOARD, itemType.CARD], boardTarget, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(itemType.BOARD, boardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export class BoardItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.boardItems,
    };
  }

  handleDelete = () => {
    this.props.deleteBoard(this.props.index);
  }

  handleShowEditFrom = () => {
    const editData = {
      boardIndex: this.props.index,
      name: this.props.boardName,
    };
    this.props.setDataForEdit(editData);
    this.props.toggleModal('edit board');
  }

  handleShowCreateCardForm = () => {
    const editData = {
      boardIndex: this.props.index,
    };
    this.props.setDataForEdit(editData);
    this.props.toggleModal('create cart');
  }

  render() {
    const {
      connectDragSource,
      connectDropTarget,
    } = this.props;
    return connectDragSource(
      connectDropTarget(
        <div className="board-item">
          <div>
            <h2>{this.props.boardName}</h2>
          </div>
          {
            this.props.boardItems.map((card, index) => (
              <DragItem
                onDragCard={this.props.onDragCard}
                index={index}
                key={card.id}
                id={card.id}
                name={card.name}
                boardIndex={this.props.index}
                toggleModal={this.props.toggleModal}
                setDataForEdit={this.props.setDataForEdit}
                deleteCard={this.props.deleteCard}
              />
            ))
          }
          <div className="board-item__control-buttons">
            <Button className="board-delete-btn" onClick={this.handleDelete}>delete</Button>
            <Button className="board-edit-btn" onClick={this.handleShowEditFrom}>edit</Button>
            <Button className="board-createCard-btn" onClick={this.handleShowCreateCardForm}>add card</Button>
          </div>
        </div>
      )
    );
  }
}

BoardItem.propTypes = {
  deleteCard: PropTypes.func,
  setDataForEdit: PropTypes.func,
  toggleModal: PropTypes.func,
  onDragCard: PropTypes.func,
  boardItems: PropTypes.array,
  index: PropTypes.number,
  boardName: PropTypes.string,
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  deleteBoard: PropTypes.func,
};

export default BoardItem;
