/* Copyright (C) 2016  IRIDE Monad <iride.monad@gmail.com>
 * License: GNU GPLv3 http://www.gnu.org/licenses/gpl-3.0.html */

import React from "react";
import MessageBox from "../common/message-box";

export default class ReadyMessage extends React.Component {
  render() {
    return (
      <MessageBox text="ready" mark="rocket" />
    );
  }
}
