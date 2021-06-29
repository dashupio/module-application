
// import react
import { Permission } from '@dashup/ui';
import React, { useState, useEffect } from 'react';

// global timer
let timer;

// global debounce
const debounce = (func, timeout = 1000) => {

  // return debounced
  return (...args) => {
    // clear timeout previously
    clearTimeout(timer);

    // create new timeout
    timer = setTimeout(() => func(...args), timeout);
  };
};

// create page model config
const PageApplicationConfig = (props = {}) => {
  // state
  let [acls, setAcls] = useState(props.page.get('data.acls') || []);
  const [key, setKey] = useState(null);

  // alls
  const allPermissions = [
    {
      name : 'view',
      icon : 'fa fa-eye',
    },
    {
      name : 'submit',
      icon : 'fa fa-pencil',
    },
    {
      name : 'manage',
      icon : 'fa fa-cog',
    }
  ];
  
  // useEffect
  useEffect(() => {
    // set key
    props.page.action('key', props.page.get('_id')).then(setKey);
  }, [props.page && props.page.get('_id')]);

  // get pages
  const getPages = (section, i) => {
    // return pages
    return Array.from(props.dashup.get('pages').values()).filter((p) => {
      // return section
      return p && !p.get('archived') && (p.get('parent') || 'root') === 'root' && ((i === 0 && !p.get('section')) || p.get('section') === section.get('_id'));
    }).sort((a, b) => {
      // get order
      if (a.get('order') > b.get('order')) return 1;
      if (a.get('order') < b.get('order')) return -1;

      // return no change
      return 0;
    });
  };

  // get sections
  const getSections = () => {
    // return sections
    return Array.from(props.dashup.get('sections').values()).filter((s) => s && !s.get('archived')).sort((a, b) => {
      // get order
      if (a.get('order') > b.get('order')) return 1;
      if (a.get('order') < b.get('order')) return -1;

      // return no change
      return 0;
    });
  };

  // on acls
  const onAcls = async (newAcls) => {
    // set
    await debounce(props.setData, 500)('acls', newAcls);

    // set
    setAcls([...newAcls]);
  };

  // has acl
  const hasAcl = (page, type) => {
    // check has permission
    if (acls.find((acl) => acl === true)) return true;

    // check type
    if (!type) return acls.includes(page);

    // check find
    return hasAcl(`${page.get('_id')}.${type}`);
  };

  // add acl
  const addAcl = (page, type, noSubs) => {
    // add
    if (!hasAcl(`${page.get('_id')}.${type}`)) {
      acls.push(`${page.get('_id')}.${type}`);
    }

    // remove from all sub pages
    const subs = noSubs ? [] : Array.from(props.dashup.get('pages').values()).filter((p) => {
      // check parent
      return p.get('parent') === page.get('_id');
    });
    const parent = Array.from(props.dashup.get('pages').values()).find((p) => p.get('_id') === page.get('parent'));

    // add to subs
    subs.forEach((sub) => addAcl(sub, type));

    // parent
    if (parent) addAcl(parent, type, true);

    // update
    onAcls([...acls]);
  };

  // remove acl
  const removeAcl = (page, type, noSubs) => {
    // add
    acls = acls.filter((a) => a !== `${page.get('_id')}.${type}`);

    // remove from all sub pages
    const subs = noSubs ? [] : Array.from(props.dashup.get('pages').values()).filter((p) => {
      // check parent
      return p.get('parent') === page.get('_id');
    });

    // add to subs
    subs.forEach((sub) => removeAcl(sub, type));

    // update
    onAcls([...acls]);
  }

  // has all
  const hasAll = (type) => {
    // get pages
    return !Array.from(props.dashup.get('pages').values()).find((page) => {
      // return has
      return !hasAcl(page, type);
    });
  };

  // has any
  const hasAny = (type) => {
    // get pages
    return !hasAll(type) && !!Array.from(props.dashup.get('pages').values()).find((page) => {
      // return has
      return hasAcl(page, type);
    });
  };

  // on all
  const onAll = (e, type) => {
    // prevent
    e.preventDefault();
    e.stopPropagation();

    // check toggle
    if (hasAll(type)) {
      // return has
      acls = acls.filter((acl) => {
        return !`${acl}`.includes(type);
      });
    } else {
      // add pages
      Array.from(props.dashup.get('pages').values()).find((page) => {
        // return has
        if (!hasAcl(page, type)) {
          // check view
          acls.push(`${page.get('_id')}.${type}`);
        }
      });
    }

    // update
    onAcls([...acls]);
  };

  // return jsx
  return (
    <>
      { !!key && (
        <div className="mb-3">
          <label className="form-label">
            API Key
          </label>
          <div className="mb-3">
            <input className="form-control" readOnly name="key" value={ key } />
          </div>
        </div>
      ) }
      
      <hr />

      <div className="card card-body">
        <div className="card card-permission bg-transparent shadow-none mb-2">
          <div className="card-body d-flex align-items-center">

            <div className="ms-auto">
              { allPermissions.map((permission, i) => {
                // return jsx
                return (
                  <button
                    key={ `permission-${permission.name}` }
                    onClick={ (e) => onAll(e, permission.name) }
                    className={ `btn ms-2 ${hasAll(permission.name) ? 'btn-success' : (hasAny(permission.name) ? 'btn-warning' : 'btn-secondary')}` }
                    >
                    <i className={ permission.icon } />
                  </button>
                );
              }) }
            </div>
          </div>
        </div>

        { getSections().map((section, i) => {
          // return jsx
          return (
            <React.Fragment key={ `section-${section.get('_id')}` }>
              { i !== 0 && <hr /> }
              { getPages(section, i).map((page, a) => {
                // return jsx
                return (
                  <Permission
                    key={ `page-${page.get('_id')}` }
                    page={ page }
                    dashup={ props.dashup }
                    hasAcl={ hasAcl }
                    addAcl={ addAcl }
                    removeAcl={ removeAcl }
                  />
                );
              }) }
            </React.Fragment>
          );
        }) }
      </div>
    </>
  )
};

// export default
export default PageApplicationConfig;