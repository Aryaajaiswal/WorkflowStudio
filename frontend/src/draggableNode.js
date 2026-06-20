// draggableNode.js

export const DraggableNode = ({ type, label, icon: Icon, category }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.currentTarget.classList.add('vs-palette-item--dragging');
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = (event) => {
    event.currentTarget.classList.remove('vs-palette-item--dragging');
  };

  return (
    <div
      className="vs-palette-item"
      style={{ '--node-accent': `var(--cat-${category})` }}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={onDragEnd}
      draggable
    >
      <span className="vs-palette-item-icon" aria-hidden="true">
        {Icon ? <Icon size={16} strokeWidth={2.25} /> : null}
      </span>
      <span className="vs-palette-item-label">{label}</span>
    </div>
  );
};
