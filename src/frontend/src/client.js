import fetch from 'unfetch';

const checkStatus = response => {
    if (response.ok) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
}

export const getAllProjects = () =>
    fetch("api/v1/projectslist")
    .then(checkStatus);

export const addNewProject = project =>
    fetch("api/v1/projectslist", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(project)
        }
    );

export const deleteProject = projectId =>
    fetch(`api/v1/projectslist/${projectId}`, {
        method: 'DELETE'
    }).then(checkStatus);

export const updateProject = project =>
    fetch("api/v1/projectslist", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(project)
    })

