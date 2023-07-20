import { useEffect, useState } from "react";

interface Atom<AtomType> {
    get: () => AtomType;
    set: (newValue: AtomType) => void;
    subscribe: (callback: (newValue: AtomType) => void) => () => void;
    _subscribers: () => number;
}

type AtomGetter<AtomType> = (
    get: <Target>(a: Atom<Target>) => Target
) => AtomType;

type AtomSetter<AtomType> = (newValue: AtomType) => void;

export function atom<AtomType>(
    initialValue: AtomType | AtomGetter<AtomType>
): Atom<AtomType> {
    let value: AtomType =
        typeof initialValue === "function" ? (null as AtomType) : initialValue;

    const subscribers = new Set<(newValue: AtomType) => void>();
    const subscribed = new Set<Atom<any>>();

    function get<Target>(atom: Atom<Target>) {
        let currentValue = atom.get();

        if (!subscribed.has(atom)) {
            subscribed.add(atom);
            atom.subscribe(function (newValue) {
                if (currentValue === newValue) return;
                currentValue = newValue;
                computeValue();
            });
        }

        return currentValue;
    }

    async function computeValue() {
        const newValue =
            typeof initialValue === "function"
                ? (initialValue as AtomGetter<AtomType>)(get)
                : value;
        value = (null as AtomType);
        value = await newValue;
        subscribers.forEach((callback) => callback(value));
    }

    computeValue();

    return {
        get: () => value,
        set: (newValue) => {
            value = newValue;
            computeValue();
        },
        subscribe: (callback) => {
            subscribers.add(callback);
            return () => {
                subscribers.delete(callback);
            };
        },
        _subscribers: () => subscribers.size,
    };
}

type useAtomType<T, G = any> = [T, AtomSetter<G>];

export function useAtom<AtomType>(atom: Atom<AtomType>): useAtomType<AtomType> {
    const [value, setValue] = useState(atom.get());

    useEffect(() => {
        const unsubscribe = atom.subscribe(setValue);

        return () => {
            unsubscribe();
        }
    }, [atom])

    return [value, atom.set];
}

export function useAtomValue<AtomType>(atom: Atom<AtomType>) {
    const [value, setValue] = useState(atom.get());

    useEffect(() => {
        const unsubscribe = atom.subscribe(setValue);

        return () => {
            unsubscribe();
        }
    }, [atom])

    return value;
}
