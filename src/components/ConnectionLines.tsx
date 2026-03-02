import { useEffect, useRef } from "react";

interface Connection {
  buyerId: string;
  propertyId: string;
}

interface ConnectionLinesProps {
  connections: Connection[];
  highlightedConnections: string[];
}

export function ConnectionLines({ connections, highlightedConnections }: ConnectionLinesProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const container = svg.parentElement;
    if (!container) return;

    // Очищаем существующие линии
    svg.innerHTML = `
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="#93C5FD"
          />
        </marker>
        <marker
          id="arrowhead-active"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="#1976D2"
          />
        </marker>
      </defs>
    `;

    // Показываем линии только если есть подсвеченные соединения
    if (highlightedConnections.length > 0) {
      connections.forEach(({ buyerId, propertyId }) => {
        const buyerElement = document.querySelector(`[data-buyer-id="${buyerId}"]`);
        const propertyElement = document.querySelector(`[data-property-id="${propertyId}"]`);

        if (buyerElement && propertyElement) {
          const buyerRect = buyerElement.getBoundingClientRect();
          const propertyRect = propertyElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          const startX = buyerRect.right - containerRect.left;
          const startY = buyerRect.top + buyerRect.height / 2 - containerRect.top;
          const endX = propertyRect.left - containerRect.left;
          const endY = propertyRect.top + propertyRect.height / 2 - containerRect.top;

          const isHighlighted = 
            highlightedConnections.includes(buyerId) || 
            highlightedConnections.includes(propertyId);

          // Создаем белую подложку для линии
          const backgroundLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
          backgroundLine.setAttribute("x1", startX.toString());
          backgroundLine.setAttribute("y1", startY.toString());
          backgroundLine.setAttribute("x2", endX.toString());
          backgroundLine.setAttribute("y2", endY.toString());
          backgroundLine.setAttribute("stroke", "white");
          backgroundLine.setAttribute("stroke-width", "6");
          backgroundLine.setAttribute("opacity", "0.9");
          svg.appendChild(backgroundLine);

          // Основная линия
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", startX.toString());
          line.setAttribute("y1", startY.toString());
          line.setAttribute("x2", endX.toString());
          line.setAttribute("y2", endY.toString());
          line.setAttribute("stroke", "#1976D2");
          line.setAttribute("stroke-width", "4");
          line.setAttribute("marker-end", "url(#arrowhead-active)");
          line.setAttribute("opacity", isHighlighted ? "1" : "0.3");
          line.style.filter = "drop-shadow(0 0 4px rgba(25, 118, 210, 0.3))";
          line.style.transition = "all 0.2s ease";

          svg.appendChild(line);
        }
      });
    }
  }, [connections, highlightedConnections]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
}