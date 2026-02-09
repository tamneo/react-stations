export type TListener<T extends object> = (arsg: T) => any;
export type TEventReturn<T = any> = T;

/**
 * Parent station
 */
export class Station<
    TState extends {},
    TEvents extends { [key: string]: TEventReturn } = {}
> {
    private readonly _listeners = new Map<
        TListener<TState>,
        TListener<TState>
    >();

    private readonly _eventListeners: Partial<{
        [key in keyof TEvents]: Map<(args: TEvents[key]) => any, undefined>;
    }> = Object();

    protected state: TState = Object();

    /**
     * Subcribe station by listener(s)
     * @param args
     */
    public subscribe(
        args: Required<{
            listeners: TListener<TState> | Array<TListener<TState>>;
        }>
    ) {
        const { listeners } = args;
        const convertedListeners = !Array.isArray(listeners)
            ? [listeners]
            : listeners;

        try {
            for (let i = 0; i < convertedListeners.length; i++) {
                if (this._listeners.has(convertedListeners[i])) {
                    continue;
                }

                this._listeners.set(
                    convertedListeners[i],
                    convertedListeners[i]
                );
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Unsubcribe station on specific listenter(s)
     * @param args
     */
    public unsubscribe(
        args: Required<{
            listeners: TListener<TState> | Array<TListener<TState>>;
        }>
    ) {
        const { listeners } = args;
        const convertedListeners = !Array.isArray(listeners)
            ? [listeners]
            : listeners;

        try {
            for (let i = 0; i < convertedListeners.length; i++) {
                if (!this._listeners.has(convertedListeners[i])) {
                    continue;
                }

                this._listeners.delete(convertedListeners[i]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     * @param args
     */
    public subscribeOnEvent<TEventName extends keyof TEvents>(
        args: Required<{
            eventName: TEventName;
            listeners: (
                args: TEvents[TEventName]
            ) =>
                | any
                | Promise<any>
                | Array<(args: TEvents[TEventName]) => any | Promise<any>>;
        }>
    ) {
        const { eventName, listeners } = args;
        const convertedListeners = !Array.isArray(listeners)
            ? [listeners]
            : listeners;

        try {
            if (!this._eventListeners[eventName]) {
                this._eventListeners[eventName] = new Map();

                for (let i = 0; i < convertedListeners.length; i++) {
                    this._eventListeners[eventName]?.set(
                        convertedListeners[i],
                        undefined
                    );
                }
            } else {
                for (let i = 0; i < convertedListeners.length; i++) {
                    if (
                        !this._eventListeners[eventName]?.has(
                            convertedListeners[i]
                        )
                    ) {
                        this._eventListeners[eventName]?.set(
                            convertedListeners[i],
                            undefined
                        );
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Subcribe on customize event
     * @param args
     */
    public unsubscribeOnEvent<TEventName extends keyof TEvents>(
        args: Required<{
            eventName: TEventName;
            listeners: (
                args: TEvents[TEventName]
            ) =>
                | any
                | Promise<any>
                | Array<(args: TEvents[TEventName]) => any | Promise<any>>;
        }>
    ) {
        const { eventName, listeners } = args;
        const convertedListeners = !Array.isArray(listeners)
            ? [listeners]
            : listeners;

        try {
            if (!this._eventListeners[eventName]) {
                return;
            }

            for (let i = 0; i < convertedListeners.length; i++) {
                if (
                    !this._eventListeners[eventName]?.has(convertedListeners[i])
                ) {
                    continue;
                }

                this._eventListeners[eventName]?.delete(convertedListeners[i]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Update state and emit new state changes to listening React component(s)
     * @param args
     */
    protected setState(args: TState) {
        this.state = { ...args };

        try {
            if (this._listeners.size < 1) {
                return;
            }

            const entries = this._listeners.entries();
            const keys: TListener<TState>[] = [];

            for (const [key] of entries) {
                keys.push(key);
            }

            Promise.allSettled(keys.map((key) => key(this.state)));
        } catch (error) {
            console.error(error);
        }
    }

    /**
     *
     * @param args
     * @returns
     */
    protected dispatch<TEventName extends keyof TEvents>(
        args: Required<{
            eventName: TEventName;
            data: TEvents[TEventName];
        }>
    ) {
        try {
            const { eventName, data } = args;

            const listeners = this._eventListeners[eventName];

            if (!listeners) {
                return;
            }

            const entries = listeners.entries();
            const keys: Array<(args: TEvents[TEventName]) => any> = [];

            for (const [key] of entries) {
                keys.push(key);
            }

            Promise.allSettled(keys.map((key) => key(data)));
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @deprecated
     */
    get $state() {
        return { ...this.state };
    }
}
