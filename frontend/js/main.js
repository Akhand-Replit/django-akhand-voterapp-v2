document.addEventListener('DOMContentLoaded', () => {
    // --- Global State ---
    let originalRecords = []; // Used for modals, holds the currently displayed page of records
    let currentAllDataParams = {};
    let currentRecordForFamily = null; 
    let selectedRelativeForFamily = null; 
    let professionChart = null;
    let genderChart = null;
    let ageChart = null;
    let batchChart = null;

    // --- Global Element References ---
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutButton = document.getElementById('logout-button');
    const sidebar = document.getElementById('sidebar');
    const mobileMenuButton = document.getElementById('mobile-menu-button');

    const navLinks = {
        dashboard: document.getElementById('nav-dashboard'),
        search: document.getElementById('nav-search'),
        add: document.getElementById('nav-add'),
        upload: document.getElementById('nav-upload'),
        alldata: document.getElementById('nav-alldata'),
        datamanagement: document.getElementById('nav-datamanagement'),
        events: document.getElementById('nav-events'),
        eventcollector: document.getElementById('nav-event-collector'),
        relationships: document.getElementById('nav-relationships'),
        analysis: document.getElementById('nav-analysis'),
        age: document.getElementById('nav-age'),
        familytree: document.getElementById('nav-familytree'),
        callhistory: document.getElementById('nav-callhistory'),
    };

    const pages = {
        dashboard: document.getElementById('dashboard-page'),
        search: document.getElementById('search-page'),
        add: document.getElementById('add-page'),
        upload: document.getElementById('upload-page'),
        alldata: document.getElementById('alldata-page'),
        datamanagement: document.getElementById('datamanagement-page'),
        events: document.getElementById('events-page'),
        eventcollector: document.getElementById('event-collector-page'),
        relationships: document.getElementById('relationships-page'),
        analysis: document.getElementById('analysis-page'),
        age: document.getElementById('age-page'),
        familytree: document.getElementById('familytree-page'),
        callhistory: document.getElementById('callhistory-page'),
    };

    // Search Page Elements
    const searchForm = document.getElementById('search-form');
    const searchResultsContainer = document.getElementById('search-results');
    const searchPaginationContainer = document.getElementById('search-pagination');
    
    // Add/Upload Page Elements
    const addRecordForm = document.getElementById('add-record-form');
    const addRecordBatchSelect = document.getElementById('add-record-batch');
    const addRecordSuccessMessage = document.getElementById('add-record-success');
    const uploadDataForm = document.getElementById('upload-data-form');
    const uploadStatus = document.getElementById('upload-status');
    
    // All Data Page Elements
    const allDataBatchSelect = document.getElementById('alldata-batch-select');
    const allDataFileSelect = document.getElementById('alldata-file-select');
    const allDataTableContainer = document.getElementById('alldata-table-container');
    const allDataStatus = document.getElementById('alldata-status');
    const allDataPaginationContainer = document.getElementById('alldata-pagination');

    // Data Management Page Elements
    const dataManagementStatus = document.getElementById('data-management-status');
    const dmBatchSelect = document.getElementById('dm-batch-select');
    const dmFileSelect = document.getElementById('dm-file-select');
    const deleteFileBtn = document.getElementById('delete-file-btn');
    const dmBatchDeleteSelect = document.getElementById('dm-batch-delete-select');
    const deleteBatchBtn = document.getElementById('delete-batch-btn');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    
    // Edit Modal Elements
    const editRecordModal = document.getElementById('edit-record-modal');
    const editRecordForm = document.getElementById('edit-record-form');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalCloseButtonX = document.getElementById('modal-close-button-x');
    const modalSaveButton = document.getElementById('modal-save-button');
    const editRecordIdInput = document.getElementById('edit-record-id');
    const openFamilyManagerBtn = document.getElementById('open-family-manager-btn');
    const currentFamilyMembersList = document.getElementById('current-family-members-list');

    // Family Manager Modal Elements
    const familyManagerModal = document.getElementById('family-manager-modal');
    const familyModalCloseBtnX = document.getElementById('family-modal-close-button-x');
    const familyTabExisting = document.getElementById('family-tab-existing');
    const familyTabNew = document.getElementById('family-tab-new');
    const addExistingMemberTab = document.getElementById('add-existing-member-tab');
    const addNewMemberTab = document.getElementById('add-new-member-tab');
    const familyMemberSearchInput = document.getElementById('family-member-search-input');
    const familyMemberSearchResults = document.getElementById('family-member-search-results');
    const selectedFamilyMemberDetails = document.getElementById('selected-family-member-details');
    const addExistingMemberForm = document.getElementById('add-existing-member-form');
    const existingMemberRelationshipInput = document.getElementById('existing-member-relationship');
    const addExistingFamilyMemberBtn = document.getElementById('add-existing-family-member-btn');
    const addExistingStatus = document.getElementById('add-existing-status');
    const addNewFamilyMemberForm = document.getElementById('add-new-family-member-form');
    const addNewStatus = document.getElementById('add-new-status');

    // Event Collector Page Elements
    const eventCollectorSelect = document.getElementById('event-collector-select');
    const eventCollectorSearchContainer = document.getElementById('event-collector-search-container');
    const eventCollectorSearchForm = document.getElementById('event-collector-search-form');
    const eventCollectorSearchResults = document.getElementById('event-collector-search-results');
    const eventCollectorSearchPagination = document.getElementById('event-collector-search-pagination');
    const eventCollectorConnectedListContainer = document.getElementById('event-collector-connected-list-container');
    const eventCollectorConnectedList = document.getElementById('event-collector-connected-list');
    const eventCollectorConnectedPagination = document.getElementById('event-collector-connected-pagination');
    let collectorConnectedRecordIds = new Set();

    // Other Page Elements
    const relTabs = document.querySelectorAll('.rel-tab-button');
    const relContentContainer = document.getElementById('relationships-content');
    const relPaginationContainer = document.getElementById('relationships-pagination');
    const analysisBatchSelect = document.getElementById('analysis-batch-select');
    const analysisContent = document.getElementById('analysis-content');
    const recalculateAgesButton = document.getElementById('recalculate-ages-button');
    const ageRecalculationStatus = document.getElementById('age-recalculation-status');
    const familyMainSearchInput = document.getElementById('family-main-search');
    const familyMainSearchResults = document.getElementById('family-main-search-results');
    const familyManagementSection = document.getElementById('family-management-section');
    const familySelectedPersonDetails = document.getElementById('family-selected-person-details');
    const familyCurrentRelatives = document.getElementById('family-current-relatives');
    const familyRelativeSearchInput = document.getElementById('family-relative-search');
    const familyRelativeSearchResults = document.getElementById('family-relative-search-results');
    const familyAddForm = document.getElementById('family-add-form');
    const relationshipTypeInput = document.getElementById('relationship-type');
    const addRelationshipButton = document.getElementById('add-relationship-button');
    const familyAddStatus = document.getElementById('family-add-status');
    const familyTreePagination = document.getElementById('family-tree-pagination');
    let selectedPersonId = null;
    let selectedRelativeId = null;
    const callHistorySearchInput = document.getElementById('callhistory-search');
    const callHistorySearchResults = document.getElementById('callhistory-search-results');
    const callHistoryManagementSection = document.getElementById('callhistory-management-section');
    const callHistorySelectedPerson = document.getElementById('callhistory-selected-person');
    const callHistoryLogsContainer = document.getElementById('callhistory-logs-container');
    const addCallLogForm = document.getElementById('add-call-log-form');
    const callLogStatus = document.getElementById('call-log-status');
    const callHistoryPagination = document.getElementById('callhistory-pagination');
    let selectedPersonForCallHistory = null;
    const addEventForm = document.getElementById('add-event-form');
    const newEventNameInput = document.getElementById('new-event-name');
    const addEventStatus = document.getElementById('add-event-status');
    const existingEventsList = document.getElementById('existing-events-list');
    const eventFilterSelect = document.getElementById('event-filter-select');
    const filterByEventButton = document.getElementById('filter-by-event-button');
    const eventFilterResults = document.getElementById('event-filter-results');
    const eventFilterPagination = document.getElementById('event-filter-pagination');
    
    // --- Event Listeners ---
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    
    if(mobileMenuButton) mobileMenuButton.addEventListener('click', () => sidebar.classList.toggle('-translate-x-full'));
    Object.values(navLinks).forEach(link => link && link.addEventListener('click', handleNavigation));

    if (searchForm) searchForm.addEventListener('submit', (e) => handleSearch(e));
    if (addRecordForm) addRecordForm.addEventListener('submit', handleAddRecord);
    if (uploadDataForm) uploadDataForm.addEventListener('submit', handleUploadData);
    if (allDataBatchSelect) allDataBatchSelect.addEventListener('change', handleAllDataBatchSelect);
    if (allDataFileSelect) allDataFileSelect.addEventListener('change', () => handleAllDataFileSelect());
    if (relTabs) relTabs.forEach(tab => tab.addEventListener('click', () => handleRelTabClick(tab)));
    if (recalculateAgesButton) recalculateAgesButton.addEventListener('click', handleRecalculateAges);
    if (familyMainSearchInput) familyMainSearchInput.addEventListener('input', debounce(handleFamilyTreeSearch, 300));
    if (familyRelativeSearchInput) familyRelativeSearchInput.addEventListener('input', debounce(handleFamilyTreeSearch, 300));
    if (addRelationshipButton) addRelationshipButton.addEventListener('click', handleAddRelationship);
    if (callHistorySearchInput) callHistorySearchInput.addEventListener('input', debounce(handleCallHistorySearch, 300));
    if (addCallLogForm) addCallLogForm.addEventListener('submit', handleAddCallLog);
    if (addEventForm) addEventForm.addEventListener('submit', handleAddEvent);
    if (filterByEventButton) filterByEventButton.addEventListener('click', () => handleFilterByEvent());
    if (analysisBatchSelect) analysisBatchSelect.addEventListener('change', () => loadAnalysisCharts(analysisBatchSelect.value));

    
    // Data Management Listeners
    if (dmBatchSelect) dmBatchSelect.addEventListener('change', handleDMFileSelectChange);
    if (deleteFileBtn) deleteFileBtn.addEventListener('click', handleDeleteFile);
    if (deleteBatchBtn) deleteBatchBtn.addEventListener('click', handleDeleteBatch);
    if (deleteAllBtn) deleteAllBtn.addEventListener('click', handleDeleteAllData);

    // Event Collector Listeners
    if(eventCollectorSelect) eventCollectorSelect.addEventListener('change', handleEventCollectorSelect);
    if(eventCollectorSearchForm) eventCollectorSearchForm.addEventListener('submit', (e) => handleEventCollectorSearch(e));
    if(eventCollectorSearchResults) eventCollectorSearchResults.addEventListener('click', handleEventConnectionClick);
    if(eventCollectorConnectedList) eventCollectorConnectedList.addEventListener('click', handleEventConnectionClick);

    // Modal Listeners
    if (modalCloseButton) modalCloseButton.addEventListener('click', () => editRecordModal.classList.add('hidden'));
    if (modalCloseButtonX) modalCloseButtonX.addEventListener('click', () => editRecordModal.classList.add('hidden'));
    if (modalSaveButton) modalSaveButton.addEventListener('click', handleModalSave);

    // Family Manager Modal Listeners
    if (openFamilyManagerBtn) openFamilyManagerBtn.addEventListener('click', openFamilyManager);
    if (familyModalCloseBtnX) familyModalCloseBtnX.addEventListener('click', () => familyManagerModal.classList.add('hidden'));
    if (familyTabExisting) familyTabExisting.addEventListener('click', () => switchFamilyTab('existing'));
    if (familyTabNew) familyTabNew.addEventListener('click', () => switchFamilyTab('new'));
    if (familyMemberSearchInput) familyMemberSearchInput.addEventListener('input', debounce(handleFamilyMemberSearch, 300));
    if (addExistingFamilyMemberBtn) addExistingFamilyMemberBtn.addEventListener('click', handleAddExistingMember);
    if (addNewFamilyMemberForm) addNewFamilyMemberForm.addEventListener('submit', handleAddNewMemberFormSubmit);

    if (allDataTableContainer) {
        allDataTableContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                const recordId = e.target.dataset.recordId;
                openEditModal(recordId);
            }
            const row = e.target.closest('tr');
            if (row) {
                const currentlyHighlighted = allDataTableContainer.querySelector('.highlight-row');
                if (currentlyHighlighted) currentlyHighlighted.classList.remove('highlight-row');
                row.classList.add('highlight-row');
            }
        });
    }

    // --- Event Handlers ---
    async function handleLogin(e) {
        e.preventDefault();
        loginError.textContent = '';
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
            const data = await loginUser(username, password);
            localStorage.setItem('authToken', data.token);
            showApp();
        } catch (error) {
            loginError.textContent = error.message;
        }
    }
    
    function handleLogout() { 
        localStorage.removeItem('authToken'); 
        showLogin(); 
    }
    
    function handleNavigation(e) {
        e.preventDefault();
        const pageId = e.target.id;
        let pageName;

        if (pageId.startsWith('nav-')) {
            pageName = pageId.substring(4);
        } else {
            console.error('Could not determine page name from nav link id:', pageId);
            return;
        }

        navigateTo(pageName.replace('-', '')); // Adjust for event-collector
    }

    async function handleSearch(e, pageOrUrl = 1) { 
        if (e) e.preventDefault(); 
        if (!searchResultsContainer) return; 
        searchResultsContainer.innerHTML = '<p class="text-gray-500">Searching...</p>'; 
        const params = { naam: document.getElementById('search-name').value, voter_no: document.getElementById('search-voter-no').value, pitar_naam: document.getElementById('search-father-name').value, thikana: document.getElementById('search-address').value, matar_naam: document.getElementById('search-mother-name').value, kromik_no: document.getElementById('search-kromik-no').value, pesha: document.getElementById('search-profession').value, phone_number: document.getElementById('search-phone').value };
        
        let searchParams;
        if (typeof pageOrUrl === 'string') {
            searchParams = pageOrUrl;
        } else {
             const apiParams = { naam__icontains: params.naam, voter_no: params.voter_no, pitar_naam__icontains: params.pitar_naam, thikana__icontains: params.thikana, matar_naam__icontains: params.matar_naam, kromik_no: params.kromik_no, pesha__icontains: params.pesha, phone_number__icontains: params.phone_number };
            searchParams = Object.fromEntries(Object.entries(apiParams).filter(([_, v]) => v && v.trim() !== ''));
        }
        try { 
            const data = await searchRecords(searchParams); 
            originalRecords = data.results; 
            displaySearchResults(data.results); 
            displayPaginationControls(searchPaginationContainer, data.previous, data.next, (nextUrl) => handleSearch(null, nextUrl)); 
        } catch (error) { 
            searchResultsContainer.innerHTML = `<p class="text-red-500">${error.message}</p>`; 
        } 
    }

    async function handleAddRecord(e) {
        e.preventDefault();
        if (!addRecordSuccessMessage) return;
        addRecordSuccessMessage.textContent = '';
        const formData = new FormData(addRecordForm);
        const recordData = Object.fromEntries(formData.entries());

        try {
            await addRecord(recordData);
            addRecordSuccessMessage.textContent = 'Record added successfully!';
            addRecordForm.reset();
            updateDashboardStats();
        } catch (error) {
            alert(error.message);
        }
    }
    
    async function handleUploadData(e) {
        e.preventDefault();
        if (!uploadStatus) return;
        uploadStatus.innerHTML = '<p class="text-blue-600">Uploading and processing file(s)...</p>';
        const batchName = document.getElementById('upload-batch-name').value;
        const fileInput = document.getElementById('upload-file');
        const files = fileInput.files;
        const genderInput = document.querySelector('input[name="gender"]:checked');
        const gender = genderInput ? genderInput.value : null;
    
        if (!batchName || files.length === 0 || !gender) {
            uploadStatus.innerHTML = '<p class="text-red-600">Please provide a batch name, select at least one file, and choose a gender.</p>';
            return;
        }
    
        try {
            const result = await uploadData(batchName, files, gender); 
            uploadStatus.innerHTML = `<p class="text-green-600">${result.message}</p>`;
            uploadDataForm.reset();
            updateDashboardStats();
        } catch (error) {
            uploadStatus.innerHTML = `<p class="text-red-600">Error: ${error.message}</p>`;
        }
    }

    async function handleAllDataBatchSelect() { const batchId = allDataBatchSelect.value; if (!allDataFileSelect || !allDataTableContainer) return; allDataFileSelect.innerHTML = '<option value="">Loading files...</option>'; allDataTableContainer.innerHTML = ''; originalRecords = []; if (!batchId) { allDataFileSelect.innerHTML = '<option value="">Select a Batch First</option>'; return; } try { const files = await getBatchFiles(batchId); allDataFileSelect.innerHTML = '<option value="all">All Files</option>'; files.forEach(file => { const option = document.createElement('option'); option.value = file; option.textContent = file; allDataFileSelect.appendChild(option); }); handleAllDataFileSelect(); } catch (error) { allDataFileSelect.innerHTML = '<option value="">Error loading files</option>'; console.error(error); } }
    
    async function handleAllDataFileSelect(pageOrUrl = 1) { 
        if (!allDataBatchSelect || !allDataFileSelect || !allDataTableContainer) return; 
        const batchId = allDataBatchSelect.value; 
        const fileName = allDataFileSelect.value; 
        allDataTableContainer.innerHTML = '<p class="p-4 text-gray-500">Loading records...</p>'; 
        if (!batchId) return; 
        
        let params; 
        if (typeof pageOrUrl === 'string') { 
            params = pageOrUrl; 
        } else { 
            currentAllDataParams = { batch: batchId }; 
            if (fileName && fileName !== 'all') { 
                currentAllDataParams.file_name = fileName; 
            } 
            params = currentAllDataParams; 
        } 
        try { 
            const data = await searchRecords(params); 
            originalRecords = data.results; 
            renderReadOnlyTable(data.results); 
            displayPaginationControls(allDataPaginationContainer, data.previous, data.next, (nextUrl) => handleAllDataFileSelect(nextUrl)); 
        } catch (error) { 
            allDataTableContainer.innerHTML = `<p class="p-4 text-red-500">${error.message}</p>`; 
        }
    }
    
    async function openEditModal(recordId) {
        const record = originalRecords.find(r => r.id == recordId);
        
        if (!record) {
            alert('Could not find record details.');
            return;
        }

        currentRecordForFamily = record;
        editRecordIdInput.value = record.id;
        document.getElementById('edit-naam').value = record.naam || '';
        document.getElementById('edit-voter-no').value = record.voter_no || '';
        document.getElementById('edit-kromik-no').value = record.kromik_no || '';
        document.getElementById('edit-jonmo-tarikh').value = record.jonmo_tarikh || '';
        document.getElementById('edit-gender').value = record.gender || '';
        document.getElementById('edit-pitar-naam').value = record.pitar_naam || '';
        document.getElementById('edit-matar-naam').value = record.matar_naam || '';
        document.getElementById('edit-pesha').value = record.pesha || '';
        document.getElementById('edit-occupation-details').value = record.occupation_details || '';
        document.getElementById('edit-phone-number').value = record.phone_number || '';
        document.getElementById('edit-whatsapp-number').value = record.whatsapp_number || '';
        document.getElementById('edit-facebook-link').value = record.facebook_link || '';
        document.getElementById('edit-photo-link').value = record.photo_link || '';
        document.getElementById('edit-thikana').value = record.thikana || '';
        document.getElementById('edit-description').value = record.description || '';
        document.getElementById('edit-political-status').value = record.political_status || '';
        document.getElementById('edit-relationship-status').value = record.relationship_status || 'Regular';
        
        const eventsContainer = document.getElementById('edit-events-checkboxes');
        eventsContainer.innerHTML = 'Loading events...';

        try {
            const allEvents = (await getEvents()).results;
            
            eventsContainer.innerHTML = '';
            if (!allEvents || allEvents.length === 0) {
                 eventsContainer.innerHTML = '<p class="text-gray-500">No events available.</p>';
            } else {
                allEvents.forEach(event => {
                    const isChecked = record.event_names && record.event_names.includes(event.name);
                    const checkboxDiv = document.createElement('div');
                    checkboxDiv.className = 'flex items-center';
                    checkboxDiv.innerHTML = `<input id="event-${event.id}" name="events" type="checkbox" value="${event.id}" class="h-4 w-4 text-indigo-600 border-gray-300 rounded" ${isChecked ? 'checked' : ''}><label for="event-${event.id}" class="ml-2 block text-sm text-gray-900">${event.name}</label>`;
                    eventsContainer.appendChild(checkboxDiv);
                });
            }
        } catch (error) {
            eventsContainer.innerHTML = '<p class="text-red-500">Could not load events.</p>';
        }

        loadCurrentFamilyMembers(record.id);
        editRecordModal.classList.remove('hidden');
    }

    async function handleModalSave() {
        const recordId = editRecordIdInput.value;
        const updatedData = {
            naam: document.getElementById('edit-naam').value,
            voter_no: document.getElementById('edit-voter-no').value,
            kromik_no: document.getElementById('edit-kromik-no').value,
            jonmo_tarikh: document.getElementById('edit-jonmo-tarikh').value,
            gender: document.getElementById('edit-gender').value,
            pitar_naam: document.getElementById('edit-pitar-naam').value,
            matar_naam: document.getElementById('edit-matar-naam').value,
            pesha: document.getElementById('edit-pesha').value,
            occupation_details: document.getElementById('edit-occupation-details').value,
            phone_number: document.getElementById('edit-phone-number').value,
            whatsapp_number: document.getElementById('edit-whatsapp-number').value,
            facebook_link: document.getElementById('edit-facebook-link').value,
            photo_link: document.getElementById('edit-photo-link').value,
            thikana: document.getElementById('edit-thikana').value,
            description: document.getElementById('edit-description').value,
            political_status: document.getElementById('edit-political-status').value,
            relationship_status: document.getElementById('edit-relationship-status').value,
        };
        const selectedEventIds = Array.from(document.querySelectorAll('#edit-events-checkboxes input:checked')).map(cb => cb.value);
        const statusContainer = document.querySelector('.active')?.id === 'alldata-page' ? allDataStatus : searchResultsContainer;
        
        statusContainer.innerHTML = `<p class="text-blue-600">Saving record ${recordId}...</p>`;
        try {
            await updateRecord(recordId, updatedData);
            await assignEventsToRecord(recordId, selectedEventIds);
            statusContainer.innerHTML = `<p class="text-green-600">Successfully saved record ${recordId}!</p>`;
            editRecordModal.classList.add('hidden');
            if (document.querySelector('.active')?.id === 'alldata-page') {
                 handleAllDataFileSelect(currentAllDataParams);
            } else {
                 handleSearch(null);
            }
        } catch (error) {
            statusContainer.innerHTML = `<p class="text-red-500">Error saving changes: ${error.message}</p>`;
        }
    }
    
    function openFamilyManager() {
        familyMemberSearchInput.value = '';
        familyMemberSearchResults.innerHTML = '';
        selectedFamilyMemberDetails.innerHTML = '';
        selectedFamilyMemberDetails.classList.add('hidden');
        addExistingMemberForm.classList.add('hidden');
        existingMemberRelationshipInput.value = '';
        addExistingStatus.textContent = '';
        addNewFamilyMemberForm.reset();
        addNewStatus.textContent = '';
        selectedRelativeForFamily = null;
        switchFamilyTab('existing');
        familyManagerModal.classList.remove('hidden');
    }

    function switchFamilyTab(tab) { if (tab === 'existing') { addExistingMemberTab.classList.remove('hidden'); addNewMemberTab.classList.add('hidden'); familyTabExisting.classList.add('active'); familyTabNew.classList.remove('active'); } else { addExistingMemberTab.classList.add('hidden'); addNewMemberTab.classList.remove('hidden'); familyTabExisting.classList.remove('active'); familyTabNew.classList.add('active'); } }

    async function loadCurrentFamilyMembers(recordId) {
        currentFamilyMembersList.innerHTML = '<p class="text-gray-500 text-sm">Loading family members...</p>';
        try {
            const data = await getFamilyTree(recordId);
            currentFamilyMembersList.innerHTML = '';
            if (data.results && data.results.length > 0) {
                data.results.forEach(rel => {
                    const memberDiv = document.createElement('div');
                    memberDiv.className = 'text-sm p-1.5 flex justify-between items-center';
                    memberDiv.innerHTML = `<div><span class="font-semibold text-gray-700">${rel.relationship_type}:</span><span class="text-gray-600 ml-2">${rel.relative.naam}</span></div><button data-id="${rel.id}" class="remove-relative-btn text-red-400 hover:text-red-600 text-xs">Remove</button>`;
                    currentFamilyMembersList.appendChild(memberDiv);
                });
            } else {
                currentFamilyMembersList.innerHTML = '<p class="text-gray-500 text-sm">No family members added yet.</p>';
            }
             document.querySelectorAll('.remove-relative-btn').forEach(btn => btn.addEventListener('click', handleRemoveRelationship));

        } catch (error) {
            currentFamilyMembersList.innerHTML = `<p class="text-red-500 text-sm">Error loading family: ${error.message}</p>`;
        }
    }

    async function handleFamilyMemberSearch() {
        const query = familyMemberSearchInput.value.trim();
        familyMemberSearchResults.innerHTML = '';
        if (query.length < 2) return;
        
        try {
            const data = await searchRecords({ naam__icontains: query, page_size: 5 });
            const results = data.results || [];
            
            if (results.length > 0) {
                results.forEach(record => {
                    if (record.id === currentRecordForFamily.id) return;
                    const resultBtn = document.createElement('button');
                    resultBtn.className = 'block w-full text-left p-2 hover:bg-gray-100';
                    resultBtn.textContent = `${record.naam} (Voter No: ${record.voter_no || 'N/A'})`;
                    resultBtn.onclick = () => { selectedRelativeForFamily = record; familyMemberSearchResults.innerHTML = ''; selectedFamilyMemberDetails.innerHTML = `<p class="text-sm font-medium">Selected: ${record.naam}</p>`; selectedFamilyMemberDetails.classList.remove('hidden'); addExistingMemberForm.classList.remove('hidden'); };
                    familyMemberSearchResults.appendChild(resultBtn);
                });
            } else {
                familyMemberSearchResults.innerHTML = '<p class="p-2 text-sm text-gray-500">No results found.</p>';
            }
        } catch (error) {
             familyMemberSearchResults.innerHTML = `<p class="p-2 text-sm text-red-500">${error.message}</p>`;
        }
    }

    async function handleAddExistingMember() {
        const relationshipType = existingMemberRelationshipInput.value.trim();
        if (!selectedRelativeForFamily || !relationshipType) { addExistingStatus.textContent = 'Please select a person and define the relationship.'; addExistingStatus.className = 'text-red-500 text-sm text-center mt-2'; return; }
        addExistingStatus.textContent = 'Adding...';
        addExistingStatus.className = 'text-blue-500 text-sm text-center mt-2';
        try {
            await addFamilyMember(currentRecordForFamily.id, selectedRelativeForFamily.id, relationshipType);
            addExistingStatus.textContent = 'Successfully added!';

            addExistingStatus.className = 'text-green-600 text-sm text-center mt-2';
            setTimeout(() => { familyManagerModal.classList.add('hidden'); loadCurrentFamilyMembers(currentRecordForFamily.id); }, 1000);
        } catch (error) { addExistingStatus.textContent = `Error: ${error.message}`; addExistingStatus.className = 'text-red-500 text-sm text-center mt-2'; }
    }

    async function handleAddNewMemberFormSubmit(e) {
        e.preventDefault();
        const newMemberNameInput = document.getElementById('new-member-name');
        const newMemberRelationshipInput = document.getElementById('new-member-relationship');
        const name = newMemberNameInput.value.trim();
        const relationship = newMemberRelationshipInput.value.trim();
        if (!name || !relationship) { addNewStatus.textContent = 'Name and Relationship are required.'; addNewStatus.className = 'text-red-500 text-sm text-center mt-2'; return; }
        const newRecordData = { naam: name, voter_no: document.getElementById('new-member-voter-no').value, pitar_naam: document.getElementById('new-member-father').value, matar_naam: document.getElementById('new-member-mother').value, phone_number: document.getElementById('new-member-phone').value, kromik_no: 'N/A' };
        addNewStatus.textContent = 'Creating new record...';
        addNewStatus.className = 'text-blue-500 text-sm text-center mt-2';
        try {
            const newRecord = await addRecord(newRecordData);
            addNewStatus.textContent = 'Linking family member...';
            await addFamilyMember(currentRecordForFamily.id, newRecord.id, relationship);
            addNewStatus.textContent = 'Successfully added!';
            addNewStatus.className = 'text-green-600 text-sm text-center mt-2';
            setTimeout(() => { familyManagerModal.classList.add('hidden'); loadCurrentFamilyMembers(currentRecordForFamily.id); }, 1000);
        } catch (error) { addNewStatus.textContent = `Error: ${error.message}`; addNewStatus.className = 'text-red-500 text-sm text-center mt-2'; }
    }

    function handleRelTabClick(clickedTab) { if (!relTabs) return; relTabs.forEach(tab => tab.classList.remove('active')); clickedTab.classList.add('active'); const status = clickedTab.dataset.status; if (status === 'Stats') { displayRelationshipStats(); } else { displayRelationshipList(status); } }
    async function handleRecalculateAges() { if (!ageRecalculationStatus) return; ageRecalculationStatus.innerHTML = '<p class="text-blue-600">Recalculating ages for all records. This might take a moment...</p>'; try { const result = await recalculateAllAges(); ageRecalculationStatus.innerHTML = `<p class="text-green-600">${result.message}</p>`; initializeAgeManagementPage(); } catch (error) { ageRecalculationStatus.innerHTML = `<p class="text-red-600">Error: ${error.message}</p>`; } }
    
    async function handleFamilyTreeSearch(event) {
        const input = event.target;
        const query = input.value.trim();
        const isMainSearch = input.id === 'family-main-search';
        const resultsContainer = isMainSearch ? familyMainSearchResults : familyRelativeSearchResults;
        if (!query) {
            resultsContainer.innerHTML = '';
            return;
        }
        try {
            const data = await searchRecords({
                naam__icontains: query,
                page_size: 10
            });
            resultsContainer.innerHTML = '';
            if (data.results.length === 0) {
                resultsContainer.innerHTML = '<p class="text-gray-500">No results found.</p>';
            } else {
                data.results.forEach(record => {
                    const button = document.createElement('button');
                    button.className = 'block w-full text-left p-2 rounded hover:bg-gray-100';
                    button.textContent = `${record.naam} (Voter No: ${record.voter_no || 'N/A'})`;
                    button.onclick = () => {
                        if (isMainSearch) {
                            selectMainPerson(record);
                        } else {
                            selectRelative(record);
                        }
                    };
                    resultsContainer.appendChild(button);
                });
            }
        } catch (error) {
            resultsContainer.innerHTML = `<p class="text-red-500">${error.message}</p>`;
        }
    }

    function selectMainPerson(person) { selectedPersonId = person.id; familySelectedPersonDetails.innerHTML = `<p><strong>Name:</strong> ${person.naam}</p><p><strong>Voter No:</strong> ${person.voter_no || 'N/A'}</p>`; familyManagementSection.classList.remove('hidden'); familyMainSearchResults.innerHTML = ''; familyMainSearchInput.value = person.naam; loadFamilyTree(person.id); }
    function selectRelative(relative) { selectedRelativeId = relative.id; familyRelativeSearchResults.innerHTML = `<p class="p-2 bg-green-100 rounded">Selected: ${relative.naam}</p>`; familyRelativeSearchInput.value = relative.naam; familyAddForm.classList.remove('hidden'); }
    async function loadFamilyTree(personId, url = null) { familyCurrentRelatives.innerHTML = '<p class="text-gray-500">Loading relatives...</p>'; try { const data = await getFamilyTree(personId, url); familyCurrentRelatives.innerHTML = ''; if (data.results.length === 0) { familyCurrentRelatives.innerHTML = '<p class="text-gray-500">No relatives added yet.</p>'; } else { data.results.forEach(rel => { const relDiv = document.createElement('div'); relDiv.className = 'flex justify-between items-center p-2 border-b'; relDiv.innerHTML = ` <div> <span class="font-bold">${rel.relationship_type}:</span> <span>${rel.relative.naam} (Voter No: ${rel.relative.voter_no || 'N/A'})</span> </div> <button data-id="${rel.id}" class="remove-relative-btn text-red-500 hover:text-red-700">Remove</button> `; familyCurrentRelatives.appendChild(relDiv); }); document.querySelectorAll('.remove-relative-btn').forEach(btn => { btn.addEventListener('click', handleRemoveRelationship); }); } displayPaginationControls(familyTreePagination, data.previous, data.next, (nextUrl) => loadFamilyTree(personId, nextUrl)); } catch (error) { familyCurrentRelatives.innerHTML = `<p class="text-red-500">${error.message}</p>`; } }
    async function handleAddRelationship() { const relationshipType = relationshipTypeInput.value.trim(); if (!selectedPersonId || !selectedRelativeId || !relationshipType) { familyAddStatus.textContent = 'Please select a main person, a relative, and enter a relationship type.'; return; } familyAddStatus.textContent = 'Adding...'; try { await addFamilyMember(selectedPersonId, selectedRelativeId, relationshipType); familyAddStatus.textContent = 'Relationship added successfully!'; familyRelativeSearchInput.value = ''; relationshipTypeInput.value = ''; selectedRelativeId = null; familyRelativeSearchResults.innerHTML = ''; familyAddForm.classList.add('hidden'); loadFamilyTree(selectedPersonId); } catch (error) { familyAddStatus.textContent = `Error: ${error.message}`; } }
    
    async function handleRemoveRelationship(event) {
        const relationshipId = event.target.dataset.id;
        if (!confirm('Are you sure you want to remove this relationship?')) return;
        
        try {
            await removeFamilyMember(relationshipId);
            if (!familyManagerModal.classList.contains('hidden') || !editRecordModal.classList.contains('hidden')) {
                loadCurrentFamilyMembers(currentRecordForFamily.id);
            } else if (pages.familytree.classList.contains('active')) {
                 loadFamilyTree(selectedPersonId);
            }
        } catch (error) {
            alert(`Failed to remove relationship: ${error.message}`);
        }
    }

    
    async function handleCallHistorySearch(event) { 
        const query = event.target.value.trim(); 
        if (!query) { 
            callHistorySearchResults.innerHTML = ''; 
            return; 
        } 
        
        try { 
            const data = await searchRecords({ naam__icontains: query, page_size: 10 }); 
            callHistorySearchResults.innerHTML = ''; 
            if (data.results.length === 0) { 
                callHistorySearchResults.innerHTML = '<p class="text-gray-500">No results found.</p>'; 
            } else { 
                data.results.forEach(record => { 
                    const button = document.createElement('button'); 
                    button.className = 'block w-full text-left p-2 rounded hover:bg-gray-100'; 
                    button.textContent = `${record.naam} (Voter No: ${record.voter_no || 'N/A'})`; 
                    button.onclick = () => selectPersonForCallHistory(record); 
                    callHistorySearchResults.appendChild(button); 
                }); 
            } 
        } catch (error) { 
            callHistorySearchResults.innerHTML = `<p class="text-red-500">${error.message}</p>`; 
        }
     }
    function selectPersonForCallHistory(person) { selectedPersonForCallHistory = person; callHistorySelectedPerson.innerHTML = `<p><strong>Name:</strong> ${person.naam}</p><p><strong>Voter No:</strong> ${person.voter_no || 'N/A'}</p>`; callHistoryManagementSection.classList.remove('hidden'); callHistorySearchResults.innerHTML = ''; callHistorySearchInput.value = person.naam; loadCallHistory(person.id); }
    async function loadCallHistory(recordId, url = null) { callHistoryLogsContainer.innerHTML = '<p class="text-gray-500">Loading history...</p>'; try { const data = await getCallHistory(recordId, url); callHistoryLogsContainer.innerHTML = ''; if (data.results.length === 0) { callHistoryLogsContainer.innerHTML = '<p class="text-gray-500">No call history found for this person.</p>'; } else { data.results.forEach(log => { const logDiv = document.createElement('div'); logDiv.className = 'p-3 border rounded-lg bg-gray-50'; logDiv.innerHTML = ` <p class="font-bold text-gray-700">${log.call_date}</p> <p class="text-gray-600 mt-1">${log.summary}</p> `; callHistoryLogsContainer.appendChild(logDiv); }); } displayPaginationControls(callHistoryPagination, data.previous, data.next, (nextUrl) => loadCallHistory(recordId, nextUrl)); } catch (error) { callHistoryLogsContainer.innerHTML = `<p class="text-red-500">${error.message}</p>`; } }
    async function handleAddCallLog(event) { 
        event.preventDefault(); 
        const callDate = document.getElementById('call-date').value; 
        const summary = document.getElementById('call-summary').value.trim(); 
        if (!callDate || !summary) { 
            callLogStatus.textContent = 'Please fill out all fields.'; 
            return; 
        } 
        callLogStatus.textContent = 'Saving...'; 
        try { 
            await addCallLog(selectedPersonForCallHistory.id, callDate, summary); 
            callLogStatus.textContent = 'Log saved successfully!'; 
            addCallLogForm.reset(); 
            loadCallHistory(selectedPersonForCallHistory.id); 
        } catch (error) { 
            callLogStatus.textContent = `Error: ${error.message}`; 
        } 
    }

    async function initializeEventsPage() {
        try {
            const events = (await getEvents()).results;
            populateEventList(events);
            populateEventFilterDropdown(events);
        } catch (error) {
            if(existingEventsList) existingEventsList.innerHTML = `<p class="text-red-500">${error.message}</p>`;
            if(eventFilterSelect) eventFilterSelect.innerHTML = `<option>Error loading events</option>`;
        }
    }

    async function handleAddEvent(e) { 
        e.preventDefault(); 
        const eventName = newEventNameInput.value.trim(); 
        if (!eventName) { 
            addEventStatus.textContent = 'Event name cannot be empty.'; 
            addEventStatus.className = 'text-red-500 text-sm'; 
            return; 
        } 
        addEventStatus.textContent = 'Adding...'; 
        addEventStatus.className = 'text-blue-600 text-sm'; 
        try { 
            await addEvent(eventName); 
            addEventStatus.textContent = 'Event added successfully!'; 
            addEventStatus.className = 'text-green-600 text-sm'; 
            addEventForm.reset(); 
            initializeEventsPage(); 
        } catch (error) { 
            addEventStatus.textContent = error.message; 
            addEventStatus.className = 'text-red-500 text-sm'; 
        } 
    }

    async function handleDeleteEvent(eventId) { 
        if (!confirm('Are you sure you want to delete this event? This cannot be undone.')) return; 
        try { 
            await deleteEvent(eventId); 
            initializeEventsPage(); 
        } catch (error) { 
            alert(error.message); 
        } 
    }

    async function handleFilterByEvent(url = null) { const eventId = eventFilterSelect.value; if (!eventId || isNaN(parseInt(eventId))) { eventFilterResults.innerHTML = '<p class="text-gray-600">Please select a valid event to filter.</p>'; return; } eventFilterResults.innerHTML = '<p class="text-gray-500">Loading records...</p>'; try { const data = await getRecordsForEvent(eventId, url); displayEventRecords(data.results); displayPaginationControls(eventFilterPagination, data.previous, data.next, (nextUrl) => handleFilterByEvent(nextUrl)); } catch (error) { eventFilterResults.innerHTML = `<p class="text-red-500">${error.message}</p>`; } }

    function populateEventList(events) { if (!existingEventsList) return; existingEventsList.innerHTML = ''; if (!events || events.length === 0) { existingEventsList.innerHTML = '<p class="text-gray-500">No events created yet.</p>'; return; } events.forEach(event => { const div = document.createElement('div'); div.className = 'flex justify-between items-center p-2 border-b'; div.innerHTML = `<span>${event.name}</span><button data-event-id="${event.id}" class="delete-event-btn text-red-500 hover:text-red-700 text-sm">Delete</button>`; existingEventsList.appendChild(div); }); document.querySelectorAll('.delete-event-btn').forEach(btn => btn.addEventListener('click', (e) => handleDeleteEvent(e.target.dataset.eventId))); }

    function populateEventFilterDropdown(events) { if (!eventFilterSelect) return; eventFilterSelect.innerHTML = '<option value="">Select an Event</option>'; if (!events) return; events.forEach(event => { const option = document.createElement('option'); option.value = event.id; option.textContent = event.name; eventFilterSelect.appendChild(option); }); }

    function displayEventRecords(records) { if (!eventFilterResults) return; eventFilterResults.innerHTML = ''; if (!records || records.length === 0) { eventFilterResults.innerHTML = '<p class="text-gray-600">No records found for this event.</p>'; return; } records.forEach(record => { const card = document.createElement('div'); card.className = 'search-card-detailed'; const safeText = (text) => text || '<span class="text-gray-400">N/A</span>'; card.innerHTML = `<div class="search-card-header"><h3>${safeText(record.naam)}</h3><span class="kromik-no">Serial No: ${safeText(record.kromik_no)}</span></div><div class="search-card-body"><img src="${record.photo_link}" alt="Voter Photo" class="search-card-photo" onerror="this.onerror=null;this.src='https://placehold.co/100x100/EEE/31343C?text=No+Image';"><div class="search-card-details-grid"><div class="detail-item"><span class="label">Voter No:</span> ${safeText(record.voter_no)}</div><div class="detail-item"><span class="label">Father's Name:</span> ${safeText(record.pitar_naam)}</div><div class="detail-item"><span class="label">Address:</span> ${safeText(record.thikana)}</div><div class="detail-item"><span class="label">Batch:</span> ${safeText(record.batch_name)}</div><div class="detail-item"><span class="label">Assigned Events:</span> ${safeText(record.event_names.join(', '))}</div></div></div>`; eventFilterResults.appendChild(card); }); }
    
    // --- Event Collector Functions ---
    async function initializeEventCollectorPage() {
        try {
            const events = (await getEvents()).results;
            populateEventCollectorDropdown(events);
        } catch (error) {
            if (eventCollectorSelect) eventCollectorSelect.innerHTML = `<option>Error loading events</option>`;
        }
        eventCollectorSearchContainer.classList.add('hidden');
        eventCollectorConnectedListContainer.classList.add('hidden');
        eventCollectorSearchResults.innerHTML = '';
        eventCollectorConnectedList.innerHTML = '';
        collectorConnectedRecordIds.clear();
    }
    
    function populateEventCollectorDropdown(events) {
        if (!eventCollectorSelect) return;
        eventCollectorSelect.innerHTML = '<option value="">-- Select an Event --</option>';
        if (!events) return;
        events.forEach(event => {
            const option = document.createElement('option');
            option.value = event.id;
            option.textContent = event.name;
            eventCollectorSelect.appendChild(option);
        });
    }

    async function handleEventCollectorSelect() {
        const eventId = eventCollectorSelect.value;
        eventCollectorSearchResults.innerHTML = '';
        eventCollectorSearchPagination.innerHTML = '';
        if (eventCollectorSearchForm) eventCollectorSearchForm.reset();

        if (eventId) {
            eventCollectorSearchContainer.classList.remove('hidden');
            eventCollectorConnectedListContainer.classList.remove('hidden');
            loadConnectedRecordsForCollector(eventId);
        } else {
            eventCollectorSearchContainer.classList.add('hidden');
            eventCollectorConnectedListContainer.classList.add('hidden');
        }
    }

    async function loadConnectedRecordsForCollector(eventId, url = null) {
        if (!eventCollectorConnectedList) return;
        eventCollectorConnectedList.innerHTML = '<p class="text-gray-500">Loading connected records...</p>';
        
        try {
            const data = await getRecordsForEvent(eventId, url);
            collectorConnectedRecordIds.clear();
            data.results.forEach(r => collectorConnectedRecordIds.add(r.id));
            displayCollectorCards(eventCollectorConnectedList, data.results);
            displayPaginationControls(eventCollectorConnectedPagination, data.previous, data.next, (nextUrl) => loadConnectedRecordsForCollector(eventId, nextUrl));
        } catch (error) {
            eventCollectorConnectedList.innerHTML = `<p class="text-red-500">Error loading records: ${error.message}</p>`;
        }
    }

    async function handleEventCollectorSearch(e, pageOrUrl = 1) {
        if (e) e.preventDefault();
        eventCollectorSearchResults.innerHTML = '<p class="text-gray-500">Searching...</p>';
        
        const params = {
            naam: document.getElementById('event-collector-search-name').value,
            voter_no: document.getElementById('event-collector-search-voter-no').value,
            pitar_naam: document.getElementById('event-collector-search-father-name').value,
            phone_number: document.getElementById('event-collector-search-phone').value,
            thikana: document.getElementById('event-collector-search-address').value
        };
        const apiParams = {
            naam__icontains: params.naam,
            voter_no: params.voter_no,
            pitar_naam__icontains: params.pitar_naam,
            phone_number__icontains: params.phone_number,
            thikana__icontains: params.thikana
        };
        const searchParams = Object.fromEntries(Object.entries(apiParams).filter(([_, v]) => v && v.trim() !== ''));

        try {
            const data = await searchRecords(searchParams);
            displayCollectorCards(eventCollectorSearchResults, data.results);
            displayPaginationControls(eventCollectorSearchPagination, data.previous, data.next, (nextUrl) => handleEventCollectorSearch(null, nextUrl));
        } catch (error) {
            eventCollectorSearchResults.innerHTML = `<p class="text-red-500">${error.message}</p>`;
        }
    }

    function displayCollectorCards(container, records) {
        container.innerHTML = '';
        if (!records || records.length === 0) {
            container.innerHTML = '<p class="text-gray-600">No records found.</p>';
            return;
        }
    
        records.forEach(record => {
            const isConnected = collectorConnectedRecordIds.has(record.id);
            const card = document.createElement('div');
            card.className = 'bg-white p-4 rounded-lg shadow-md flex items-start';
            const safeText = (text) => text || '<span class="text-gray-400">N/A</span>';
    
            card.innerHTML = `
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                         <h3 class="text-lg font-bold text-gray-800">${safeText(record.naam)}</h3>
                         <button 
                            data-record-id="${record.id}" 
                            data-record-name="${record.naam}"
                            class="connect-toggle-btn px-4 py-2 rounded-lg text-white transition ${ isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600' }">
                            ${ isConnected ? 'Disconnect' : 'Connect' }
                        </button>
                    </div>
                    <p class="text-sm text-gray-500">Voter No: ${safeText(record.voter_no)}</p>
                    <div class="mt-2 text-sm space-y-1 text-gray-600">
                        <p><strong>Father's Name:</strong> ${safeText(record.pitar_naam)}</p>
                        <p><strong>Mother's Name:</strong> ${safeText(record.matar_naam)}</p>
                        <p><strong>Age:</strong> ${safeText(record.age)}</p>
                        <p><strong>Batch:</strong> ${safeText(record.batch_name)}</p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }
    
    async function handleEventConnectionClick(e) {
        if (!e.target.classList.contains('connect-toggle-btn')) return;

        const button = e.target;
        const recordId = button.dataset.recordId;
        const eventId = eventCollectorSelect.value;
        const recordName = button.dataset.recordName;

        if (!eventId) {
            alert('Please select an event first.');
            return;
        }

        const isConnected = collectorConnectedRecordIds.has(parseInt(recordId));
        
        button.disabled = true;
        button.textContent = '...';

        try {
            // Fetch the record's current events first
            const recordDetails = await searchRecords({ id: recordId });
            if (!recordDetails.results || recordDetails.results.length === 0) {
                 throw new Error('Record not found');
            }
            const record = recordDetails.results[0];
            const eventDetails = await getEvents(); // Assuming this gets all events
            
            let currentEventIds = record.event_names.map(name => {
                const event = eventDetails.results.find(e => e.name === name);
                return event ? event.id : null;
            }).filter(id => id !== null);

            if (isConnected) {
                // Disconnect
                currentEventIds = currentEventIds.filter(id => id != eventId);
            } else {
                // Connect
                if (!currentEventIds.includes(parseInt(eventId))) {
                    currentEventIds.push(parseInt(eventId));
                }
            }
            
            await assignEventsToRecord(recordId, currentEventIds);
            
            // Refresh the connected list to show the change
            loadConnectedRecordsForCollector(eventId);

            // Also update the button in the search results if it exists
            const searchResultCardButton = eventCollectorSearchResults.querySelector(`button[data-record-id='${recordId}']`);
            if(searchResultCardButton) {
                const nowConnected = !isConnected;
                searchResultCardButton.textContent = nowConnected ? 'Disconnect' : 'Connect';
                searchResultCardButton.classList.toggle('bg-red-500', nowConnected);
                searchResultCardButton.classList.toggle('hover:bg-red-600', nowConnected);
                searchResultCardButton.classList.toggle('bg-green-500', !nowConnected);
                searchResultCardButton.classList.toggle('hover:bg-green-600', !nowConnected);
            }

        } catch (error) {
            alert(`Error updating connection for ${recordName}: ${error.message}`);
            // Revert button text on failure
            button.textContent = isConnected ? 'Disconnect' : 'Connect';
        } finally {
             button.disabled = false;
        }
    }

    // --- Data Management Functions ---
    async function initializeDataManagementPage() {
        dataManagementStatus.innerHTML = '';
        dmFileSelect.innerHTML = '<option value="">Select a Batch First</option>';
        dmFileSelect.disabled = true;
        deleteFileBtn.disabled = true;
    
        try {
            const batchesData = await getBatches();
            const batches = batchesData.results;
            dmBatchSelect.innerHTML = '<option value="">Select a Batch</option>';
            dmBatchDeleteSelect.innerHTML = '<option value="">Select a Batch</option>';
            batches.forEach(batch => {
                const option1 = document.createElement('option');
                option1.value = batch.id;
                option1.textContent = batch.name;
                dmBatchSelect.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = batch.id;
                option2.textContent = batch.name;
                dmBatchDeleteSelect.appendChild(option2);
            });
        } catch (error) {
            dataManagementStatus.innerHTML = `<p class="text-red-500">Error loading batches: ${error.message}</p>`;
        }
    }

    async function handleDMFileSelectChange() {
        const batchId = dmBatchSelect.value;
        dmFileSelect.innerHTML = '<option value="">Loading files...</option>';
        if (!batchId) {
            dmFileSelect.innerHTML = '<option value="">Select a Batch First</option>';
            dmFileSelect.disabled = true;
            deleteFileBtn.disabled = true;
            return;
        }
        try {
            const files = await getBatchFiles(batchId);
            dmFileSelect.innerHTML = '<option value="">Select a File</option>';
            files.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                dmFileSelect.appendChild(option);
            });
            dmFileSelect.disabled = false;
            deleteFileBtn.disabled = false;
        } catch (error) {
            dmFileSelect.innerHTML = '<option value="">Error loading files</option>';
        }
    }

    async function handleDeleteFile() {
        const batchId = dmBatchSelect.value;
        const fileName = dmFileSelect.value;
        if (!batchId || !fileName) {
            alert('Please select a batch and a file to delete.');
            return;
        }
        if (confirm(`Are you sure you want to delete all records from the file "${fileName}" in this batch? This action cannot be undone.`)) {
            dataManagementStatus.innerHTML = '<p class="text-blue-600">Deleting file data...</p>';
            try {
                const result = await deleteFileData(batchId, fileName);
                dataManagementStatus.innerHTML = `<p class="text-green-600">${result.message}</p>`;
                initializeDataManagementPage(); // Refresh the dropdowns
                updateDashboardStats(); // Update dashboard counts
            } catch (error) {
                dataManagementStatus.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
            }
        }
    }
    
    async function handleDeleteBatch() {
        const batchId = dmBatchDeleteSelect.value;
        if (!batchId) {
            alert('Please select a batch to delete.');
            return;
        }
        if (confirm(`Are you sure you want to delete the entire batch "${dmBatchDeleteSelect.options[dmBatchDeleteSelect.selectedIndex].text}" and all its records? This action cannot be undone.`)) {
            dataManagementStatus.innerHTML = '<p class="text-blue-600">Deleting batch...</p>';
            try {
                await deleteBatch(batchId);
                dataManagementStatus.innerHTML = `<p class="text-green-600">Successfully deleted the batch.</p>`;
                initializeDataManagementPage(); // Refresh the dropdowns
                updateDashboardStats();
            } catch (error) {
                dataManagementStatus.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
            }
        }
    }
    
    async function handleDeleteAllData() {
        const confirmation1 = prompt('This will delete EVERYTHING. To confirm, type "DELETE ALL DATA" in the box below.');
        if (confirmation1 !== 'DELETE ALL DATA') {
            alert('Confirmation text did not match. Aborting.');
            return;
        }
        const confirmation2 = confirm('This is your final warning. Are you absolutely certain you want to permanently delete all records and batches?');
        if (confirmation2) {
            dataManagementStatus.innerHTML = '<p class="text-blue-600">Deleting all data from the database...</p>';
            try {
                const result = await deleteAllData();
                dataManagementStatus.innerHTML = `<p class="text-green-600">${result.message}</p>`;
                initializeDataManagementPage(); // Refresh the dropdowns
                updateDashboardStats();
            } catch (error) {
                dataManagementStatus.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
            }
        } else {
            alert('Aborted.');
        }
    }

    function navigateTo(pageName) {
        if (!pages[pageName]) return;
        Object.values(pages).forEach(page => page && page.classList.add('hidden'));
        Object.values(navLinks).forEach(link => link && link.classList.remove('active'));
        pages[pageName].classList.remove('hidden');
        if (navLinks[pageName]) {
            navLinks[pageName].classList.add('active');
        } else {
            console.warn(`No navLink found for page: ${pageName}`);
        }
    
        // Page-specific initializations
        if (pageName === 'events') initializeEventsPage();
        if (pageName === 'add') populateBatchDropdown();
        if (pageName === 'alldata') initializeAllDataPage();
        if (pageName === 'relationships') initializeRelationshipsPage();
        if (pageName === 'analysis') initializeAnalysisPage();
        if (pageName === 'age') initializeAgeManagementPage();
        if (pageName === 'familytree') initializeFamilyTreePage();
        if (pageName === 'callhistory') initializeCallHistoryPage();
        if (pageName === 'eventcollector') initializeEventCollectorPage();
        if (pageName === 'datamanagement') initializeDataManagementPage();
    }

    function displayPaginationControls(container, prevUrl, nextUrl, callback) { if (!container) return; container.innerHTML = ''; const prevButton = document.createElement('button'); prevButton.textContent = 'Previous'; prevButton.className = 'px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'; prevButton.disabled = !prevUrl; prevButton.addEventListener('click', () => callback(prevUrl)); const nextButton = document.createElement('button'); nextButton.textContent = 'Next'; nextButton.className = 'px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'; nextButton.disabled = !nextUrl; nextButton.addEventListener('click', () => callback(nextUrl)); container.appendChild(prevButton); container.appendChild(nextButton); }
    
    function renderReadOnlyTable(records) { if (!allDataTableContainer) return; allDataTableContainer.innerHTML = ''; if (!records || records.length === 0) { allDataTableContainer.innerHTML = '<p class="p-4 text-gray-600">No records found for this selection.</p>'; return; } const table = document.createElement('table'); table.className = 'min-w-full divide-y divide-gray-200'; table.innerHTML = ` <thead class="bg-gray-50"> <tr> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voter No</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Father's Name</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relationship</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> </tr> </thead> <tbody class="bg-white divide-y divide-gray-200"> </tbody> `; const tbody = table.querySelector('tbody'); records.forEach(record => { const row = document.createElement('tr'); row.dataset.recordId = record.id; row.className = 'cursor-pointer hover:bg-gray-50'; row.innerHTML = ` <td class="px-6 py-4 whitespace-nowrap">${record.naam || ''}</td> <td class="px-6 py-4 whitespace-nowrap">${record.voter_no || ''}</td> <td class="px-6 py-4 whitespace-nowrap">${record.pitar_naam || ''}</td> <td class="px-6 py-4 whitespace-nowrap">${record.thikana || ''}</td> <td class="px-6 py-4 whitespace-nowrap">${record.relationship_status || ''}</td> <td class="px-6 py-4 whitespace-nowrap"> <button data-record-id="${record.id}" class="edit-btn text-indigo-600 hover:text-indigo-900">Edit</button> </td> `; tbody.appendChild(row); }); allDataTableContainer.appendChild(table); }

    function displayRelationshipList(status, pageOrUrl = 1) { 
        if (!relContentContainer || !relPaginationContainer) return; 
        relContentContainer.innerHTML = '<p class="text-gray-500">Loading...</p>'; 
        relPaginationContainer.innerHTML = ''; 
        
        const params = { relationship_status: status }; 
        const url = typeof pageOrUrl === 'string' ? pageOrUrl : null;
        
        searchRecords(url || params).then(data => { 
            if (!data.results || data.results.length === 0) { 
                relContentContainer.innerHTML = `<p class="text-gray-600">No records found with status: ${status}.</p>`; 
                return; 
            } 
            const listContainer = document.createElement('div'); 
            listContainer.className = 'space-y-4'; 
            data.results.forEach(record => { 
                const card = document.createElement('div'); 
                card.className = 'result-card'; 
                card.innerHTML = ` <h3>${record.naam}</h3> <p><strong>Voter No:</strong> ${record.voter_no || 'N/A'}</p> <p><strong>Father's Name:</strong> ${record.pitar_naam || 'N/A'}</p> <p><strong>Address:</strong> ${record.thikana || 'N/A'}</p> <p><strong>Batch:</strong> ${record.batch_name}</p> `; 
                listContainer.appendChild(card); 
            }); 
            relContentContainer.innerHTML = ''; 
            relContentContainer.appendChild(listContainer); 
            displayPaginationControls(relPaginationContainer, data.previous, data.next, (nextUrl) => displayRelationshipList(status, nextUrl)); 
        }).catch(error => { 
            relContentContainer.innerHTML = `<p class="text-red-500">${error.message}</p>`; 
        });
    }
    
    async function displayRelationshipStats() { if (!relContentContainer || !relPaginationContainer) return; relContentContainer.innerHTML = '<p class="text-gray-500">Loading statistics...</p>'; relPaginationContainer.innerHTML = ''; try { const stats = await getRelationshipStats(); let byBatchHtml = '<h3>Distribution by Batch</h3><div class="space-y-4 mt-4">'; const batchData = stats.by_batch.reduce((acc, item) => { if (!acc[item.batch__name]) { acc[item.batch__name] = {}; } acc[item.batch__name][item.relationship_status] = item.count; return acc; }, {}); for (const batchName in batchData) { const counts = batchData[batchName]; byBatchHtml += ` <div class="p-4 border rounded-lg"> <h4 class="font-bold">${batchName}</h4> <div class="flex justify-center space-x-4 mt-2 items-end"> <div class="text-center"> <div class="bg-green-500 text-white text-xs py-1 flex items-center justify-center rounded-t-md" style="height: ${ (counts.Friend || 0) * 10 + 20 }px; width: 60px;">${counts.Friend || 0}</div> <div class="text-xs mt-1">Friend</div> </div> <div class="text-center"> <div class="bg-red-500 text-white text-xs py-1 flex items-center justify-center rounded-t-md" style="height: ${ (counts.Enemy || 0) * 10 + 20 }px; width: 60px;">${counts.Enemy || 0}</div> <div class="text-xs mt-1">Enemy</div> </div> <div class="text-center"> <div class="bg-yellow-500 text-white text-xs py-1 flex items-center justify-center rounded-t-md" style="height: ${ (counts.Connected || 0) * 10 + 20 }px; width: 60px;">${counts.Connected || 0}</div> <div class="text-xs mt-1">Connected</div> </div> </div> </div> `; } byBatchHtml += '</div>'; relContentContainer.innerHTML = byBatchHtml; } catch (error) { relContentContainer.innerHTML = `<p class="text-red-500">${error.message}</p>`; } }
    
    function displaySearchResults(results) { 
        if (!searchResultsContainer) return; 
        searchResultsContainer.innerHTML = ''; 
        if (!results || results.length === 0) { 
            searchResultsContainer.innerHTML = '<p class="text-gray-600">No results found.</p>'; 
            return; 
        } 
        results.forEach(record => { 
            const card = document.createElement('div'); 
            card.className = 'bg-white p-4 rounded-lg shadow-md flex space-x-4 items-start'; 
            const safeText = (text) => text || '<span class="text-gray-400">N/A</span>'; 
            card.innerHTML = `<img src="${record.photo_link}" alt="Voter Photo" class="w-24 h-24 rounded-md object-cover" onerror="this.onerror=null;this.src='https://placehold.co/100x100/EEE/31343C?text=No+Image';"><div class="flex-1"><div class="flex justify-between items-start"><h3 class="text-lg font-bold text-gray-800">${safeText(record.naam)}</h3><button class="edit-btn text-blue-500 hover:text-blue-700" data-record-id="${record.id}"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg></button></div><p class="text-sm text-gray-500">Voter No: ${safeText(record.voter_no)}</p><div class="mt-2 text-sm space-y-1 text-gray-600"><p><strong>Father's Name:</strong> ${safeText(record.pitar_naam)}</p><p><strong>Mother's Name:</strong> ${safeText(record.matar_naam)}</p><p><strong>Address:</strong> ${safeText(record.thikana)}</p><p><strong>Gender:</strong> ${safeText(record.gender)}</p><p><strong>Age:</strong> ${safeText(record.age)}</p><p><strong>Relationship:</strong> ${safeText(record.relationship_status)}</p><p><strong>Batch:</strong> ${safeText(record.batch_name)}</p><p><strong>File:</strong> ${safeText(record.file_name)}</p></div></div>`; 
            searchResultsContainer.appendChild(card); 
        }); 
        searchResultsContainer.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', (e) => openEditModal(e.currentTarget.dataset.recordId))); 
    }
    
    async function updateDashboardStats() { try { const stats = await getDashboardStats(); document.getElementById('total-records').textContent = stats.total_records; document.getElementById('total-batches').textContent = stats.total_batches; document.getElementById('total-friends').textContent = stats.friend_count; document.getElementById('total-enemies').textContent = stats.enemy_count; } catch (error) { console.error('Failed to update dashboard stats:', error); } }
    async function populateBatchDropdown() { if (!addRecordBatchSelect) return; try { const batchesData = await getBatches(); const batches = batchesData.results; addRecordBatchSelect.innerHTML = '<option value="">Select a Batch (Required)</option>'; batches.forEach(batch => { const option = document.createElement('option'); option.value = batch.id; option.textContent = batch.name; addRecordBatchSelect.appendChild(option); }); } catch (error) { console.error('Failed to populate batches:', error); } }
    function initializeRelationshipsPage() { if (!relTabs.length) return; handleRelTabClick(document.querySelector('.rel-tab-button[data-status="Friend"]')); }
    async function initializeAllDataPage() { if (!allDataTableContainer || !allDataFileSelect || !allDataStatus || !allDataBatchSelect) return; allDataTableContainer.innerHTML = ''; allDataFileSelect.innerHTML = '<option value="">Select a Batch First</option>'; allDataStatus.innerHTML = ''; originalRecords = []; try { const batchesData = await getBatches(); const batches = batchesData.results; allDataBatchSelect.innerHTML = '<option value="">Select a Batch</option>'; batches.forEach(batch => { const option = document.createElement('option'); option.value = batch.id; option.textContent = batch.name; allDataBatchSelect.appendChild(option); }); } catch (error) { console.error('Failed to initialize All Data page:', error); allDataBatchSelect.innerHTML = '<option value="">Error loading batches</option>'; } }
    
    async function initializeAnalysisPage() {
        if (!analysisBatchSelect) return;
        analysisBatchSelect.innerHTML = '<option value="">All Batches</option>'; // Reset
        try {
            const batchesData = await getBatches();
            const batches = batchesData.results;
            batches.forEach(batch => {
                const option = document.createElement('option');
                option.value = batch.id;
                option.textContent = batch.name;
                analysisBatchSelect.appendChild(option);
            });
            // Initial load for all batches
            loadAnalysisCharts();
        } catch (error) {
            analysisContent.innerHTML = `<p class="text-red-500">Failed to load batches for filtering: ${error.message}</p>`;
        }
    }

    async function loadAnalysisCharts(batchId = null) {
        if (!analysisContent) return;
        analysisContent.innerHTML = '<p class="text-gray-500">Loading analysis data...</p>';
        try {
            const stats = await getAnalysisStats(batchId);
            analysisContent.innerHTML = `
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <canvas id="profession-chart-container"></canvas>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <canvas id="gender-chart-container"></canvas>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md lg:col-span-2">
                     <canvas id="age-chart-container"></canvas>
                </div>
                <div id="batch-distribution-container" class="bg-white p-4 rounded-lg shadow-md lg:col-span-2">
                     <canvas id="batch-chart-container"></canvas>
                </div>
            `;
            renderProfessionChart(stats.professions);
            renderGenderChart(stats.genders);
            renderAgeChart(stats.age_groups);
            
            const batchContainer = document.getElementById('batch-distribution-container');
            if (!batchId && stats.batch_distribution && stats.batch_distribution.length > 0) {
                batchContainer.style.display = 'block';
                renderBatchChart(stats.batch_distribution);
            } else {
                batchContainer.style.display = 'none';
            }

        } catch (error) {
            analysisContent.innerHTML = `<p class="text-red-500">Failed to load analysis data: ${error.message}</p>`;
        }
    }
    
    function renderProfessionChart(professionData) {
        const container = document.getElementById('profession-chart-container');
        if (!container || !professionData || professionData.length === 0) { if (container) container.innerHTML = '<p class="text-gray-500">No profession data available.</p>'; return; }
        const canvas = container;
        if (professionChart) professionChart.destroy();
        const labels = professionData.map(p => p.pesha);
        const data = professionData.map(p => p.count);
        professionChart = new Chart(canvas.getContext('2d'), { type: 'doughnut', data: { labels: labels, datasets: [{ label: 'Professions', data: data, backgroundColor: ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#D946EF', '#FBBF24', '#34D399'], hoverOffset: 4 }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Voter Distribution by Profession' } } } });
    }

    function renderGenderChart(genderData) {
        const container = document.getElementById('gender-chart-container');
        if (!container || !genderData || genderData.length === 0) { if (container) container.innerHTML = '<p class="text-gray-500">No gender data available.</p>'; return; }
        const canvas = container;
        if (genderChart) genderChart.destroy();
        const labels = genderData.map(g => g.gender || 'Not Specified');
        const data = genderData.map(g => g.count);
        genderChart = new Chart(canvas.getContext('2d'), { type: 'pie', data: { labels: labels, datasets: [{ label: 'Genders', data: data, backgroundColor: ['#3B82F6', '#EC4899', '#6B7280'], hoverOffset: 4 }] }, options: { responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Voter Distribution by Gender' } } } });
    }

    function renderAgeChart(ageData) {
        const container = document.getElementById('age-chart-container');
        if (!container || !ageData) { if (container) container.innerHTML = '<p class="text-gray-500">No age data available.</p>'; return; }
        const canvas = container;
        if (ageChart) ageChart.destroy();
        const labels = ['18-25', '26-35', '36-45', '46-60', '60+'];
        const data = [ageData.group_18_25, ageData.group_26_35, ageData.group_36_45, ageData.group_46_60, ageData.group_60_plus];
        ageChart = new Chart(canvas.getContext('2d'), { type: 'bar', data: { labels: labels, datasets: [{ label: 'Number of Voters', data: data, backgroundColor: '#10B981' }] }, options: { responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Voter Distribution by Age Group' } }, scales: { y: { beginAtZero: true } } } });
    }

    function renderBatchChart(batchData) {
        const container = document.getElementById('batch-chart-container');
        if (!container || !batchData || batchData.length === 0) { if (container) container.innerHTML = '<p class="text-gray-500">No batch data available.</p>'; return; }
        const canvas = container;
        if (batchChart) batchChart.destroy();
        const labels = batchData.map(b => b.batch__name);
        const data = batchData.map(b => b.record_count);
        batchChart = new Chart(canvas.getContext('2d'), { type: 'bar', data: { labels: labels, datasets: [{ label: 'Number of Records', data: data, backgroundColor: '#6366F1' }] }, options: { responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Record Distribution by Batch' } }, scales: { y: { beginAtZero: true } } } });
    }
    
    async function initializeAgeManagementPage() { if (ageRecalculationStatus) ageRecalculationStatus.innerHTML = ''; try { const stats = await getAnalysisStats(); renderAgeChart(stats.age_groups, 'age-management-chart-container'); } catch (error) { const container = document.getElementById('age-management-chart-container'); if (container) container.parentElement.innerHTML = `<p class="text-red-500">Failed to load age chart: ${error.message}</p>`; } }

    function initializeFamilyTreePage() { if (familyMainSearchInput) familyMainSearchInput.value = ''; if (familyMainSearchResults) familyMainSearchResults.innerHTML = ''; if (familyManagementSection) familyManagementSection.classList.add('hidden'); if (familyRelativeSearchInput) familyRelativeSearchInput.value = ''; if (familyRelativeSearchResults) familyRelativeSearchResults.innerHTML = ''; if (familyAddForm) familyAddForm.classList.add('hidden'); selectedPersonId = null; selectedRelativeId = null; }
    function initializeCallHistoryPage() { if (callHistorySearchInput) callHistorySearchInput.value = ''; if (callHistorySearchResults) callHistorySearchResults.innerHTML = ''; if (callHistoryManagementSection) callHistoryManagementSection.classList.add('hidden'); if(addCallLogForm) addCallLogForm.reset(); if(callLogStatus) callLogStatus.textContent = ''; selectedPersonForCallHistory = null; }

    function debounce(func, delay) { let timeout; return function(...args) { const context = this; clearTimeout(timeout); timeout = setTimeout(() => func.apply(context, args), delay); }; }
    
    function showLogin() {
        if (loginScreen) loginScreen.classList.remove('hidden');
        if (appContainer) appContainer.classList.add('hidden');
    }

    function showApp() {
        if (loginScreen) loginScreen.classList.add('hidden');
        if (appContainer) appContainer.classList.remove('hidden');
        navigateTo('dashboard');
        updateDashboardStats();
    }
    
    function init() {
        if (localStorage.getItem('authToken')) {
            showApp();
        } else {
            showLogin();
        }
    }
    
    init();
});

