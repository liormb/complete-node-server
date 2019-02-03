function deleteProduct(btn) {
    const productId = btn.parentNode.querySelector('[name=productId').value;
    const csrfToken = btn.parentNode.querySelector('[name=_csrf').value;
    const productEl = btn.closest('article');

    fetch(`/admin/product/${productId}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrfToken,
        },
    })
    // .then(res => res.json())
    .then(data => productEl.parentNode.removeChild(productEl))
    .catch(console.log);
}
