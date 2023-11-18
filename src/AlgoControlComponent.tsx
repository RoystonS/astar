interface ControlProps {
  running: boolean;
  onStopStartToggled(): void;
}

export function AlgoControlComponent(props: ControlProps) {
  const { running, onStopStartToggled } = props;

  return (
    <div>
      Running:{' '}
      <input type="checkbox" checked={running} onChange={onStopStartToggled} />
    </div>
  );
}
