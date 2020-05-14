const addButton = document.getElementById('addButton');

let phoneDirectory = [];

const deleteRow = async (id, button) => {
  button.classList.add('loading');
  button.classList.add('disabled');
  const response = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
  await response.text();

  fetchRows();
};

const renderRows = () => {
  const tbody = document.getElementById('tbody');

  tbody.innerHTML = '';

  const rows = phoneDirectory.map(({
    id, name, phone, email, address,
  }) => {
    const row = document.createElement('tr');
    
    row.appendChild(createField(id, name, 'name'));
    row.appendChild(createField(id, phone, 'phone'));
    row.appendChild(createField(id, email, 'email'));
    row.appendChild(createField(id, address, 'address'));
    const buttonField = document.createElement('td');
    buttonField.className = 'center aligned';
    const button = document.createElement('button');
    button.className = 'ui negative basic button';
    button.innerText = 'Remove';
    button.onclick = () => deleteRow(id, button);
    buttonField.appendChild(button);
    row.appendChild(buttonField);

    return row;
  });

  rows.forEach((row) => {
    tbody.appendChild(row);
  });
};

const createField = (id, value, field) => {
  const newField = document.createElement('td');
  newField.innerText = value;
  newField.addEventListener('dblclick', () => editField(id, newField, field));
  return newField;
}

const editField = (id, td, field) => {
  if (td.classList.contains('editing')) {
    return;
  }
  let editing_field = document.querySelector('.editing');
  if (editing_field) {
    editing_field.querySelector('input').focus();
    return;
  }
  const icon_catalog = {
    name: 'user tie',
    phone: 'phone',
    email: 'envelope',
    address: 'map marker alternate'
  }
  let input_value = td.innerText;
  let input_div = document.createElement('div');
  input_div.className = 'ui icon input';
  let input = document.createElement('input');
  input.type = 'text';
  input.placeholder = field;
  input.value = input_value;
  input.addEventListener('keyup', async (e) => {
    if (e.keyCode === 27) {
      td.innerHTML = input_value;
      td.classList.remove('editing');
    } else if (e.keyCode === 13) {
      input_div.classList.add('loading');
      await updateField(id, field, input.value);
      input_div.classList.remove('loading');
    }
  });
  let icon = document.createElement('i');
  icon.className = `${icon_catalog[field]} icon`;
  input_div.appendChild(input);
  input_div.appendChild(icon);
  td.innerHTML = '';
  td.appendChild(input_div);
  td.classList.add('editing');
}

const updateField = async (contact_id, field, value) => {
  const response = await fetch(`/api/contact/${contact_id}`, {
    method: 'POST',
    body: JSON.stringify({[field]: value}),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  await response.json();

  fetchRows();
}

const fetchRows = async () => {
  const response = await fetch('/api/contacts');
  const phoneDirectoryArray = await response.json();

  phoneDirectory = [];
  phoneDirectory = phoneDirectoryArray;

  renderRows();
};

const addNewContact = async ({ name, phone, email, address }) => {
  const response = await fetch('/api/contact', {
    method: 'PUT',
    body: JSON.stringify({ name, phone, email, address}),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const newContact = await response.json();

  phoneDirectory.push(newContact);

  renderRows();
};

addButton.onclick = async () => {
  addButton.classList.add('loading');
  addButton.classList.add('disabled');
  const iName = document.getElementById('iName');
  const iPhone = document.getElementById('iPhone');
  const iEmail = document.getElementById('iEmail');
  const iAddress = document.getElementById('iAddress');

  const name = iName.value;
  const phone = iPhone.value;
  const email = iEmail.value;
  const address = iAddress.value;

  iName.value = '';
  iPhone.value = '';
  iEmail.value = '';
  iAddress.value = '';

  await addNewContact({ name, phone, email, address });
  addButton.classList.remove('loading');
  addButton.classList.remove('disabled');
};

fetchRows();
