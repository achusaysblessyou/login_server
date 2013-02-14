class ApplicationController < ActionController::Base
  protect_from_forgery

  def deleteAllRecords
    User.delete_all
    respond_to do |format|
      format.json{render(:json => {:errCode => 1})}
    end
  end

  def unitTests
=begin
    #this is for running RAILS UNIT TESTS... replaced by RSPEC tests
    %x(rake test:units > out.tmp)
    file = File.open("out.tmp","r")
    fileString = ""
    while(line = file.gets)
      fileString = fileString + line
    end
    file.close
    totalTests = Integer(fileString[/[0-9]+\stests/][/[0-9]+/])
    nrFailed = Integer(fileString[/[0-9]+\sfailures/][/[0-9]+/])
=end
    %x(rspec > out.tmp)
    file = File.open("out.tmp","r")
    fileString = ""
    while(line = file.gets)
      fileString = fileString + line
    end
    file.close
    totalTests = Integer(fileString[/[0-9]+\sexamples/][/[0-9]+/])
    nrFailed = Integer(fileString[/[0-9]+\sfailures/][/[0-9]+/])
    respond_to do |format|
      format.json{render(:json => {:totalTests => totalTests, :nrFailed => nrFailed, :output => fileString})}
    end
  end

end
