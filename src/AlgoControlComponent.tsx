import React from 'react';

interface ControlProps {
  running: boolean;
  onStopStartToggled(): void;
}

export class AlgoControlComponent extends React.Component<ControlProps, {}> {
  render() {
    let { running, onStopStartToggled } = this.props;

    return (
      <div>
        Running:{' '}
        <input
          type="checkbox"
          checked={running}
          onChange={onStopStartToggled}
        />
      </div>
    );
  }
}
