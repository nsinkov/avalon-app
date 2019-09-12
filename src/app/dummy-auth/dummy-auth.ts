
export function isAdmin() {
    if(localStorage.getItem('user_type') === null || localStorage.getItem('user_type') == undefined) {
      localStorage.setItem('user_type', 'noob');
    }
    return localStorage.getItem('user_type') === 'admin';
}