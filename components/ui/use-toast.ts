<<<<<<< HEAD
import * as React from 'react'
=======
"use client"

// Inspired by react-hot-toast library
import * as React from "react"
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37

import type {
  ToastActionElement,
  ToastProps,
<<<<<<< HEAD
} from '@/components/ui/toast'
=======
} from "@/components/ui/toast"
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
<<<<<<< HEAD
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
=======
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
} as const

let count = 0

function genId() {
<<<<<<< HEAD
  count = (count + 1) % Number.MAX_VALUE
=======
  count = (count + 1) % Number.MAX_SAFE_INTEGER
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
<<<<<<< HEAD
      type: ActionType['ADD_TOAST']
      toast: ToasterToast
    }
  | {
      type: ActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType['DISMISS_TOAST']
      toastId?: ToasterToast['id']
    }
  | {
      type: ActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
=======
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
<<<<<<< HEAD
      type: 'REMOVE_TOAST',
=======
      type: "REMOVE_TOAST",
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
<<<<<<< HEAD
    case 'ADD_TOAST':
=======
    case "ADD_TOAST":
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

<<<<<<< HEAD
    case 'UPDATE_TOAST':
=======
    case "UPDATE_TOAST":
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

<<<<<<< HEAD
    case 'DISMISS_TOAST': {
      const { toastId } = action

=======
    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
<<<<<<< HEAD

    case 'REMOVE_TOAST':
=======
    case "REMOVE_TOAST":
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

<<<<<<< HEAD
type Toast = Omit<ToasterToast, 'id'>
=======
type Toast = Omit<ToasterToast, "id">
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
<<<<<<< HEAD
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  dispatch({
    type: 'ADD_TOAST',
=======
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
<<<<<<< HEAD
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}

export { useToast, toast } 
=======
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
