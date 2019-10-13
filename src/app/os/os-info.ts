
export function isGarbageOs() {
    if(localStorage.getItem('os_type') === null || localStorage.getItem('os_type') == undefined) {
      localStorage.setItem('os_type', 'normal');
    }
    return localStorage.getItem('os_type') === 'garbage';
}