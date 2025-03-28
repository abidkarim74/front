import { useEffect, useRef } from "react";

function useChatScroll<T extends HTMLElement>(dep: any) {
	const ref = useRef<T>(null);

	useEffect(() => {
		const container = ref.current;
		if (!container) return;

		const isAtBottom =
			container.scrollHeight - container.scrollTop <= container.clientHeight + 50;

		if (isAtBottom) {
			setTimeout(() => {
				container.scrollTop = container.scrollHeight;
			}, 50); // Small delay to ensure new messages are rendered
		}
	}, [dep]);

	return ref;
}

export default useChatScroll;
