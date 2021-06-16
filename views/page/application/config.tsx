
// import react
import { Query } from '@dashup/ui';
import React, { useState, useEffect } from 'react';

// create page model config
const PageApplicationConfig = (props = {}) => {
  // state
  let [acls, setAcls] = useState([]);
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
    setAcls([...acls]);
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
    setAcls([...acls]);
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
        if (!hasAcl(`${page.get('_id')}.${type}`)) {
          // check view
          acls.push(`${page.get('_id')}.${type}`);
        }
      });
    }

    // update
    setAcls([...acls]);
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
                    className={ `btn ms-2${hasAll(permission.name) ? 'btn-success' : (hasAny(permission.name) ? 'btn-warning' : 'btn-secondary')}` }
                    >
                    <i className={ permission.icon } />
                  </button>
                );
              }) }
            </div>
          </div>
        </div>
        
        OTHER PERMISSIONS TODO
      </div>
    </>
  )
};

// export default
export default PageApplicationConfig;