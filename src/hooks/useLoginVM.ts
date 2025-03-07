import {useLoginStore} from "../stores/useLoginStore";

const useLoginVM = () => {
  const {state, setState} = useLoginStore()

  return {
    state,
  }
}

export default useLoginVM
