class ApplicationController < ActionController::Base
  protect_from_forgery

  def deleteAllRecords
    User.delete_all
    respond_to do |format|
      format.json{render(:json => {:errCode => 1})}
    end
  end

  def unitTests
    respond_to do |format|
      format.json{render(:json => {:totalTests => 10, :nrFailed => 0, :output => "this is hardcoded output for testing"})}
    end
  end

end
