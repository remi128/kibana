/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import sinon from 'sinon';
import { mount, shallow } from 'enzyme';
import { findTestSubject } from '@elastic/eui/lib/test';
import { getIndexPatternMock } from './__tests__/get_index_pattern_mock';
import {
  ControlsTab,
} from './controls_tab';

const savedObjectsClientMock = {
  find: () => {
    return Promise.resolve({
      savedObjects: [
        {
          id: 'indexPattern1',
          attributes: {
            title: 'title1'
          }
        }
      ]
    });
  }
};
const indexPatternsMock = {
  get: getIndexPatternMock
};
const scopeMock = {
  vis: {
    API: {
      savedObjectsClient: savedObjectsClientMock,
      indexPatterns: indexPatternsMock
    },
    params: {
      'controls': [
        {
          'id': '1',
          'indexPattern': 'indexPattern1',
          'fieldName': 'keywordField',
          'label': 'custom label',
          'type': 'list',
          'options': {
            'type': 'terms',
            'multiselect': true,
            'size': 5,
            'order': 'desc'
          }
        },
        {
          'id': '2',
          'indexPattern': 'indexPattern1',
          'fieldName': 'numberField',
          'label': '',
          'type': 'range',
          'options': {
            'step': 1
          }
        }
      ]
    }
  }
};
let stageEditorParams;

beforeEach(() => {
  stageEditorParams = sinon.spy();
});

test('renders ControlsTab', () => {
  const component = shallow(<ControlsTab
    scope={scopeMock}
    stageEditorParams={stageEditorParams}
  />);
  expect(component).toMatchSnapshot(); // eslint-disable-line
});

test('add control btn', () => {
  const component = mount(<ControlsTab
    scope={scopeMock}
    stageEditorParams={stageEditorParams}
  />);
  findTestSubject(component, 'inputControlEditorAddBtn').simulate('click');
  // Use custom match function since control.id is dynamically generated and never the same.
  sinon.assert.calledWith(stageEditorParams, sinon.match((newParams) => {
    if (newParams.controls.length !== 3) {
      return false;
    }
    return true;
  }, 'control not added to vis.params'));
});

test('remove control btn', () => {
  const component = mount(<ControlsTab
    scope={scopeMock}
    stageEditorParams={stageEditorParams}
  />);
  findTestSubject(component, 'inputControlEditorRemoveControl0').simulate('click');
  const expectedParams = {
    'controls': [
      {
        'id': '2',
        'indexPattern': 'indexPattern1',
        'fieldName': 'numberField',
        'label': '',
        'type': 'range',
        'options': {
          'step': 1
        }
      }
    ]
  };
  sinon.assert.calledWith(stageEditorParams, sinon.match(expectedParams));
});


test('move down control btn', () => {
  const component = mount(<ControlsTab
    scope={scopeMock}
    stageEditorParams={stageEditorParams}
  />);
  findTestSubject(component, 'inputControlEditorMoveDownControl0').simulate('click');
  const expectedParams = {
    'controls': [
      {
        'id': '2',
        'indexPattern': 'indexPattern1',
        'fieldName': 'numberField',
        'label': '',
        'type': 'range',
        'options': {
          'step': 1
        }
      },
      {
        'id': '1',
        'indexPattern': 'indexPattern1',
        'fieldName': 'keywordField',
        'label': 'custom label',
        'type': 'list',
        'options': {
          'type': 'terms',
          'multiselect': true,
          'size': 5,
          'order': 'desc'
        }
      }
    ]
  };
  sinon.assert.calledWith(stageEditorParams, sinon.match(expectedParams));
});

test('move up control btn', () => {
  const component = mount(<ControlsTab
    scope={scopeMock}
    stageEditorParams={stageEditorParams}
  />);
  findTestSubject(component, 'inputControlEditorMoveUpControl1').simulate('click');
  const expectedParams = {
    'controls': [
      {
        'id': '2',
        'indexPattern': 'indexPattern1',
        'fieldName': 'numberField',
        'label': '',
        'type': 'range',
        'options': {
          'step': 1
        }
      },
      {
        'id': '1',
        'indexPattern': 'indexPattern1',
        'fieldName': 'keywordField',
        'label': 'custom label',
        'type': 'list',
        'options': {
          'type': 'terms',
          'multiselect': true,
          'size': 5,
          'order': 'desc'
        }
      }
    ]
  };
  sinon.assert.calledWith(stageEditorParams, sinon.match(expectedParams));
});
