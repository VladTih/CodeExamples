import { fromJS, List, Map } from 'immutable';

import * as actionTypes from './constants';

const initialState = fromJS({
  isModalShowd: false,
  modalMod: '',
  editData: {},
  boards: new List([
    new Map({
      id: 1,
      name: 'Ebat doska',
      items: new List([
        new Map({
          id: 1,
          name: 'banana',
        }),
        new Map({
          id: 2,
          name: 'retard',
        }),
        new Map({
          id: 3,
          name: 'cat',
        }),
        new Map({
          id: 4,
          name: 'mug',
        }),
      ]),
    }),
    new Map({
      id: 13,
      name: 'Ebat doska2',
      items: new List([
        new Map({
          id: 13,
          name: 'banana',
        }),
        new Map({
          id: 23,
          name: 'retard',
        }),
        new Map({
          id: 33,
          name: 'cat',
        }),
        new Map({
          id: 43,
          name: 'mug',
        }),
      ]),
    }),
    new Map({
      id: 2,
      name: 'Ebat doska vtoraya',
      items: new List([
        new Map({
          id: 12,
          name: 'rock',
        }),
        new Map({
          id: 22,
          name: 'metall',
        }),
        new Map({
          id: 32,
          name: 'pop',
        }),
        new Map({
          id: 42,
          name: 'jazz',
        }),
      ]),
    }),
  ]),
});

function boardsReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.DRAGING_BOARD: {
      const dragBoard = state.get('boards').get(action.dragIndex);
      return state.set('boards', state.get('boards').splice(action.dragIndex, 1).splice(action.hoverIndex, 0, dragBoard));
    }

    case actionTypes.PUSH_CARD_TO_BOARD: {
      const cardItem = state.get('boards').get(action.sourceBoard).get('items').get(action.cardIndex);
      return state.set('boards',
        state.get('boards')
          .updateIn([action.sourceBoard, 'items'], (items) => items.delete(action.cardIndex))
          .updateIn([action.hoverIndex, 'items'], (items) => items.push(cardItem))
      );
    }

    case actionTypes.DRAGING_CARD: {
      const cardItem = state.get('boards').get(action.sourceBoard).get('items').get(action.sourceCard);
      return state.set('boards',
        state.get('boards')
          .updateIn([action.sourceBoard, 'items'], (items) => items.delete(action.sourceCard))
          .updateIn([action.targetBoard, 'items'], (items) => items.insert(action.cardTargetIndex, cardItem))
      );
    }

    case actionTypes.DELETE_BOARD:
      return state.deleteIn(['boards', action.boardIndex]);

    case actionTypes.CREATE_BOARD: {
      const newBoard = new Map({
        id: Date.now(),
        name: action.name,
        items: new List([]),
      });
      return state.updateIn(['boards'], (boards) => boards.push(newBoard));
    }

    case actionTypes.TOGGLE_MODAL:
      return state.set('isModalShowd', !state.get('isModalShowd'))
      .set('modalMod', action.mod);

    case actionTypes.SET_EDIT_DATA:
      return state.updateIn(['editData'], (editData) => (editData = action.data)); // eslint-disable-line no-unused-vars, no-param-reassign

    case actionTypes.EDIT_BOARD:
      return state.updateIn(['boards', action.boardIndex], (boards) => (
          boards.merge({
            name: action.name,
          })
        )
      );

    case actionTypes.CREATE_CARD: {
      const newItem = {
        id: Date.now(),
        name: action.cardText,
      };
      return state.set('boards',
        state.get('boards')
          .updateIn([action.boardIndex, 'items'], (items) => items.push(newItem))
      );
    }

    case actionTypes.EDIT_CARD:
      return state.set('boards',
        state.get('boards')
        .updateIn([action.boardIndex, 'items'], (items) => items
          .updateIn([action.cardIndex, 'name'], (name) => (name = action.cardText))) // eslint-disable-line no-unused-vars, no-param-reassign
      );

    case actionTypes.DELETE_CARD:
      return state.set('boards',
              state.get('boards')
                .updateIn([action.boardIndex, 'items'], (items) => items.delete(action.cardIndex)));

    default:
      return state;
  }
}

export default boardsReducer;
